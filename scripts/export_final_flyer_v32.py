#!/usr/bin/env python3
"""Rebuild the exact SAEED 2026-11-21 v32 flyer PDF from immutable repo assets.
This is a print artifact export only; no web content or layouts are changed.
"""
from __future__ import annotations
import base64
import hashlib
from pathlib import Path
import re
import shutil
import subprocess
import zlib

R = Path(__file__).resolve().parents[1]
OUT = R / "SAEED_A5_Flyer_FINAL_v32.pdf"

def check(data: bytes, length: int, sha: str, label: str) -> bytes:
    actual = hashlib.sha256(data).hexdigest()
    if len(data) != length or actual != sha:
        raise ValueError(f"{label}: length={len(data)} sha={actual}; expected {length} {sha}")
    print(f"Verified {label}: {len(data):,} bytes")
    return data

def b64(path: str) -> bytes:
    return base64.b64decode((R / path).read_text().strip(), validate=True)

def parts(prefix: str, number: int, suffix: str = ".b64") -> bytes:
    return b"".join(b64(f"{prefix}{i}{suffix}") for i in range(number))

# Repo's v31 base PDF, verified by its own on-page v32 loader.
base = b"".join((R / "flyer-file-v20" / f"part-{i:02d}.bin").read_bytes() for i in range(19))
check(base, 6981190, "bc9f8e50cc2a8dccb9a32dd14be445eabe3496f67d4ace86dd20a958e267245b", "Base PDF")

hq = check(parts("flyer-hq-v26-part", 2), 1066283, "1f1b167a8fe64f09f8813f44541fc9f8f101a875eb5ac224a9bcea473a611aee", "HQ")
fix = check(b64("flyer-hq-v27.b64"), 196440, "0952883c9d94fb5813d50736e74de7f7294ede3b0f93186b8d6e8677fce349ab", "Fix")
interior = check(parts("flyer-v28-patch-", 2), 867838, "54819a760280b6c9d0f1070059d911058392c0acf1e8c35957a5f24d16733dba", "Interior")
photos = check(parts("flyer-v29-patch-", 4), 1789164, "a96b808f2664f58d2b21be7f1305befaafb27311e699ccb44e5434ba8d572b1d", "Photos")
brand = check(parts("flyer-v30-patch-", 5), 1963648, "9f3e4496550f706cf9a04e7c95b3e489241cb99cb76dabfea0fcee4d966acca1", "Brand")
waves = check(parts("flyer-v31-patch-", 4), 1790918, "69d805a90ae763171bdb72406a8ee9388410ebe694d382b6ba95b51c09e042b0", "Waves")
full = check(base + hq + fix + interior + photos + brand + waves, 14655481,
    "88df5f9e6ed92411de3085ac650d721fea8f23bec4d7f9e7bb4da7c56cf481f5", "Final v31 PDF")

mask = b64("flyer-v32-slogan-mask.b64")
if len(mask) != 4351 or zlib.adler32(mask) != 1762694616:
    raise ValueError("v32 slogan mask failed integrity verification.")
raw = zlib.decompress(mask)
assert len(raw) == 193 * 272, (len(raw), 193 * 272)

if not re.search(rb"startxref\s+14655014\s+%%EOF\s*$", full[-600:]):
    raise ValueError("Unexpected v31 PDF trailer; refusing to alter unknown PDF")

offset = len(full)
chunks: list[bytes] = [full]
offsets: dict[int, int] = {}

def append(part: bytes | str) -> None:
    global offset
    chunk = part.encode("utf-8") if isinstance(part, str) else part
    chunks.append(chunk)
    offset += len(chunk)

def obj(n: int, body: str) -> None:
    offsets[n] = offset
    append(f"{n} 0 obj\n{body}\nendobj\n")

append("\n")
obj(13, "<</Type/Page/Contents[36 0 R 9 0 R 37 0 R 39 0 R 41 0 R 43 0 R 45 0 R 70 0 R 71 0 R 86 0 R 114 0 R 116 0 R 118 0 R 120 0 R 122 0 R 123 0 R 124 0 R 125 0 R 136 0 R 137 0 R 139 0 R]/Resources<</Font 10 0 R/ProcSet[/PDF/Text/ImageB/ImageC/ImageI]/XObject<</FormXob.bbb8cc5c5a1868905e9394627b47fad6 12 0 R/fzImg0 38 0 R/fzImg1 40 0 R/fzImg2 42 0 R/fzImg3 44 0 R/fzFrm0 85 0 R/fzImg4 113 0 R/fzFrm1 115 0 R/fzImg5 117 0 R/fzImg6 119 0 R/fzImg7 121 0 R/fzFrm2 135 0 R/Slogan32 138 0 R>>>>/MediaBox[0 0 419.5276 595.2756]/Rotate 0/Parent 2 0 R>>")

offsets[138] = offset
append(f"138 0 obj\n<</Type/XObject/Subtype/Image/Width 1540/Height 272/ImageMask true/BitsPerComponent 1/Decode[1 0]/Filter/FlateDecode/Length {len(mask)}>>\nstream\n")
append(mask)
append("\nendstream\nendobj\n")

content = (
    "q 1 1 1 rg 24.96 292.3956 369.6 65.28 re f Q\n"
    "q 24.96 326.2756 369.6 31.4 re W n 0 0 0 rg 369.6 0 0 65.28 24.96 292.3956 cm /Slogan32 Do Q\n"
    "q 24.96 292.3956 369.6 33.88 re W n .392 .490 .569 rg 369.6 0 0 65.28 24.96 292.3956 cm /Slogan32 Do Q\n"
)
offsets[139] = offset
append(f"139 0 obj\n<</Length {len(content.encode('utf-8'))}>>\nstream\n{content}endstream\nendobj\n")

xref = offset
line = lambda n: f"{offsets[n]:010d} 00000 n \n"
append("xref\n13 1\n" + line(13) + "138 2\n" + line(138) + line(139) +
       "trailer\n<</Size 140/Root 1 0 R/ID[<C3A3C3883CC2A41EC3B2337A602B293F><BD9AA6C698E43DBC7A3DD3A143FDADA3>]/Prev 14655014>>\nstartxref\n" +
       str(xref) + "\n%%EOF\n")
OUT.write_bytes(b"".join(chunks))
print("Saved:", OUT, "size:", OUT.stat().st_size, "sha256:", hashlib.sha256(OUT.read_bytes()).hexdigest())
if shutil.which("pdfinfo"):
    subprocess.run(["pdfinfo", str(OUT)], check=True)
