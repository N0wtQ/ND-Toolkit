#!/usr/bin/env python3
"""
csv_to_geojson.py — Convierte un CSV de lugares tranquilos a GeoJSON.

USO:
    python scripts/csv_to_geojson.py --input lugares.csv --output data/real.geojson
    python scripts/csv_to_geojson.py --input lugares.csv --output data/real.geojson --merge

COLUMNAS OBLIGATORIAS DEL CSV:
    nombre, tipo, direccion, ciudad, provincia, comunidad,
    latitud, longitud, fuente_url, verificacion

COLUMNAS OPCIONALES:
    cadena, hora_silenciosa_inicio, hora_silenciosa_fin, dias_semana,
    medidas (separadas por |), colectivos (separados por |),
    fuente_secundaria, contacto_web, notas, fecha_verificacion

EJEMPLO DE FILA CSV:
    Carrefour Market Ruzafa,supermercado_hora_silenciosa,Calle Sueca 45 Valencia,...,
    39.4640,-0.3693,https://autismo.org.es/...,VERIFICADO
"""

import argparse
import csv
import json
import sys
import uuid
from datetime import date
from pathlib import Path


TIPOS_VALIDOS = {
    "supermercado_hora_silenciosa",
    "centro_comercial_hora_silenciosa",
    "espacio_natural_certificado",
    "biblioteca_sala_sensorial",
    "centro_civico_zona_silencio",
    "hotel_politica_silencio",
    "sala_estudio_accesible",
}

COLUMNAS_OBLIGATORIAS = {
    "nombre", "tipo", "direccion", "ciudad", "provincia",
    "comunidad", "latitud", "longitud", "fuente_url", "verificacion",
}

COLUMNAS_LISTA = {"medidas", "colectivos"}  # separadas por |


def parse_list_field(value: str) -> list[str]:
    if not value or not value.strip():
        return []
    return [item.strip() for item in value.split("|") if item.strip()]


def validate_row(row: dict, row_num: int) -> list[str]:
    errors = []
    for col in COLUMNAS_OBLIGATORIAS:
        if not row.get(col, "").strip():
            errors.append(f"Fila {row_num}: columna '{col}' vacía o ausente.")

    try:
        lat = float(row.get("latitud", ""))
        if not (-90 <= lat <= 90):
            errors.append(f"Fila {row_num}: latitud fuera de rango ({lat}).")
    except (ValueError, TypeError):
        errors.append(f"Fila {row_num}: latitud no es un número válido.")

    try:
        lng = float(row.get("longitud", ""))
        if not (-180 <= lng <= 180):
            errors.append(f"Fila {row_num}: longitud fuera de rango ({lng}).")
    except (ValueError, TypeError):
        errors.append(f"Fila {row_num}: longitud no es un número válido.")

    tipo = row.get("tipo", "").strip()
    if tipo and tipo not in TIPOS_VALIDOS:
        errors.append(
            f"Fila {row_num}: tipo '{tipo}' no reconocido. "
            f"Válidos: {', '.join(sorted(TIPOS_VALIDOS))}"
        )

    fuente = row.get("fuente_url", "").strip()
    if fuente and not fuente.startswith(("http://", "https://")):
        errors.append(f"Fila {row_num}: fuente_url debe empezar por http/https.")

    return errors


def row_to_feature(row: dict) -> dict:
    lat = float(row["latitud"])
    lng = float(row["longitud"])

    hora_inicio = row.get("hora_silenciosa_inicio", "").strip() or None
    hora_fin = row.get("hora_silenciosa_fin", "").strip() or None

    properties = {
        "id": row.get("id", "").strip() or f"lugar-{uuid.uuid4().hex[:8]}",
        "nombre": row["nombre"].strip(),
        "tipo": row["tipo"].strip(),
        "cadena": row.get("cadena", "").strip() or None,
        "direccion": row["direccion"].strip(),
        "ciudad": row["ciudad"].strip(),
        "provincia": row["provincia"].strip(),
        "comunidad": row["comunidad"].strip(),
        "hora_silenciosa_inicio": hora_inicio,
        "hora_silenciosa_fin": hora_fin,
        "dias_semana": row.get("dias_semana", "").strip() or None,
        "medidas": parse_list_field(row.get("medidas", "")),
        "colectivos": parse_list_field(row.get("colectivos", "")),
        "verificacion": row["verificacion"].strip(),
        "fuente_url": row["fuente_url"].strip() or None,
        "fuente_secundaria": row.get("fuente_secundaria", "").strip() or None,
        "fecha_verificacion": row.get("fecha_verificacion", "").strip() or str(date.today()),
        "contacto_web": row.get("contacto_web", "").strip() or None,
        "notas": row.get("notas", "").strip() or None,
    }

    return {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [lng, lat],
        },
        "properties": properties,
    }


def load_existing_geojson(path: Path) -> list[dict]:
    if not path.exists():
        return []
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    return data.get("features", [])


def build_geojson(features: list[dict]) -> dict:
    return {
        "type": "FeatureCollection",
        "metadata": {
            "descripcion": "Lugares tranquilos verificados en España.",
            "advertencia": "Verifica siempre en la fuente oficial antes de visitar.",
            "version": "1.0.0",
            "fecha": str(date.today()),
        },
        "features": features,
    }


def main():
    parser = argparse.ArgumentParser(
        description="Convierte CSV de lugares tranquilos a GeoJSON.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument("--input", "-i", required=True, help="Ruta al CSV de entrada.")
    parser.add_argument("--output", "-o", required=True, help="Ruta al GeoJSON de salida.")
    parser.add_argument(
        "--merge", "-m", action="store_true",
        help="Fusionar con el GeoJSON existente en --output (evita duplicados por ID)."
    )
    parser.add_argument(
        "--strict", "-s", action="store_true",
        help="Abortar si hay cualquier error de validación."
    )
    parser.add_argument(
        "--encoding", default="utf-8-sig",
        help="Codificación del CSV (por defecto: utf-8-sig para Excel español)."
    )
    args = parser.parse_args()

    input_path = Path(args.input)
    output_path = Path(args.output)

    if not input_path.exists():
        print(f"[ERROR] No se encuentra el archivo: {input_path}", file=sys.stderr)
        sys.exit(1)

    # Leer CSV
    new_features = []
    all_errors = []

    with open(input_path, newline="", encoding=args.encoding) as f:
        reader = csv.DictReader(f)

        # Verificar columnas obligatorias
        if reader.fieldnames:
            missing = COLUMNAS_OBLIGATORIAS - set(reader.fieldnames)
            if missing:
                print(
                    f"[ERROR] El CSV no tiene las columnas obligatorias: {', '.join(sorted(missing))}",
                    file=sys.stderr,
                )
                sys.exit(1)

        for row_num, row in enumerate(reader, start=2):
            errors = validate_row(row, row_num)
            if errors:
                all_errors.extend(errors)
                if args.strict:
                    for e in errors:
                        print(f"[VALIDACIÓN] {e}", file=sys.stderr)
                    print("[ABORTADO] Modo strict activo.", file=sys.stderr)
                    sys.exit(1)
                else:
                    for e in errors:
                        print(f"[AVISO] {e}", file=sys.stderr)
                    if not row.get("nombre", "").strip() or not row.get("latitud", "").strip():
                        print(f"[AVISO] Fila {row_num} omitida (datos mínimos incompletos).")
                        continue

            try:
                feature = row_to_feature(row)
                new_features.append(feature)
            except Exception as exc:
                print(f"[ERROR] Fila {row_num}: {exc}", file=sys.stderr)
                if args.strict:
                    sys.exit(1)

    print(f"[INFO] {len(new_features)} lugares leídos del CSV.")

    # Merge con existente
    final_features = []
    if args.merge:
        existing = load_existing_geojson(output_path)
        existing_ids = {f["properties"]["id"] for f in existing}
        new_ids = {f["properties"]["id"] for f in new_features}

        # Conservar existentes que no se sobreescriben
        kept = [f for f in existing if f["properties"]["id"] not in new_ids]
        # Añadir nuevos / actualizados
        final_features = kept + new_features
        print(
            f"[INFO] Merge: {len(existing)} existentes + {len(new_features)} nuevos → "
            f"{len(final_features)} total ({len(existing_ids & new_ids)} sobreescritos)."
        )
    else:
        final_features = new_features

    # Escribir GeoJSON
    output_path.parent.mkdir(parents=True, exist_ok=True)
    geojson = build_geojson(final_features)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(geojson, f, ensure_ascii=False, indent=2)

    print(f"[OK] GeoJSON escrito en: {output_path} ({len(final_features)} features)")

    if all_errors:
        print(f"\n[RESUMEN] {len(all_errors)} aviso(s) de validación encontrados. Revisa el output.")


if __name__ == "__main__":
    main()
