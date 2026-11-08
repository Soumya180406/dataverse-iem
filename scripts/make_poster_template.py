import subprocess
from pptx import Presentation
from pptx.util import Mm, Pt
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR

IMG = "/app/frontend/public/images"
OUT = "/app/frontend/public/downloads"
NAVY, CARD, CYAN, PURPLE, GOLD, WHITE, MUTED, INK, LINE = (RGBColor(0x05, 0x07, 0x0E), RGBColor(0x0F, 0x17, 0x2A),
    RGBColor(0x06, 0xB6, 0xD4), RGBColor(0x8B, 0x5C, 0xF6), RGBColor(0xF5, 0x9E, 0x0B), RGBColor(0xFF, 0xFF, 0xFF),
    RGBColor(0x64, 0x74, 0x8B), RGBColor(0x0F, 0x17, 0x2A), RGBColor(0xCB, 0xD5, 0xE1))


def rect(s, x, y, w, h, fill, shape=MSO_SHAPE.RECTANGLE, line=None):
    r = s.shapes.add_shape(shape, x, y, w, h)
    r.fill.solid(); r.fill.fore_color.rgb = fill
    if line:
        r.line.color.rgb = line; r.line.width = Pt(2)
    else:
        r.line.fill.background()
    return r


def text(s, x, y, w, h, value, size, color, bold=False, italic=False, align=PP_ALIGN.LEFT):
    tf = s.shapes.add_textbox(x, y, w, h).text_frame; tf.word_wrap = True
    p = tf.paragraphs[0]; p.alignment = align
    r = p.add_run(); r.text = value
    r.font.size, r.font.bold, r.font.italic, r.font.name = Pt(size), bold, italic, "Calibri"; r.font.color.rgb = color
    return tf


def add_line(tf, value, size, color, bold=False, italic=False, before=6):
    p = tf.add_paragraph(); p.space_before = Pt(before)
    r = p.add_run(); r.text = value
    r.font.size, r.font.bold, r.font.italic, r.font.name = Pt(size), bold, italic, "Calibri"; r.font.color.rgb = color


def logos(s, right, y, h, gap):
    w = int(h * 1.6)
    for i, k in enumerate(["iem", "uem"]):
        x = right - (2 - i) * w - (1 - i) * gap
        chip = rect(s, x, y, w, h, WHITE, MSO_SHAPE.ROUNDED_RECTANGLE); chip.adjustments[0] = 0.1
        pad = int(h * 0.07)
        s.shapes.add_picture(f"{IMG}/logo_{k}.png", x + pad, y + pad, height=h - 2 * pad)


# ---------- A1 portrait poster template ----------
prs = Presentation()
prs.slide_width, prs.slide_height = Mm(594), Mm(841)
W, H = prs.slide_width, prs.slide_height
s = prs.slides.add_slide(prs.slide_layouts[6])
M = Mm(25)

rect(s, 0, 0, W, Mm(190), NAVY)
rect(s, 0, Mm(190), W, Mm(4), CYAN)
logos(s, W - M, Mm(22), Mm(60), Mm(8))
text(s, M, Mm(24), Mm(330), Mm(14), "DATAVERSE 2K27  •  POSTER PRESENTATION", 40, CYAN, True)
text(s, M, Mm(42), Mm(330), Mm(10), "13–14 February 2027  •  IEM Kolkata", 30, GOLD, True)
text(s, M, Mm(90), W - 2 * M, Mm(62), "[POSTER TITLE — CLEAR & SHORT, MAX 2 LINES]", 84, WHITE, True)
text(s, M, Mm(160), W - 2 * M, Mm(26), "[Participant Name]  •  [Department, Year]  •  [College Name]  •  [Email]", 40, RGBColor(0xCB, 0xD5, 0xE1))

SECTIONS = [
    ("1. Introduction", "[Background of the topic and why it matters. 80–120 words.]"),
    ("2. Objective", "[What question are you answering? 2–3 bullet points.]"),
    ("3. Data & Methodology", "[Dataset source, size, tools and techniques used. Add a workflow diagram.]"),
    ("4. Results & Analysis", "[Key charts, graphs or tables with short captions. This should be the largest section.]"),
    ("5. Conclusion", "[3–4 key findings and their real-world impact.]"),
    ("6. References", "[3–5 sources in any standard citation format.]"),
]
colw = (W - 2 * M - Mm(20)) // 2
top = Mm(215)
COLS = [[(0, 160), (2, 220), (4, 160)], [(1, 130), (3, 300), (5, 110)]]
layout = []
for col, items in enumerate(COLS):
    y = top
    for idx, hmm in items:
        layout.append((col, y, Mm(hmm), idx))
        y += Mm(hmm) + Mm(15)
for col, y, h, idx in layout:
    title, hint = SECTIONS[idx]
    x = M + col * (colw + Mm(20))
    box = rect(s, x, y, colw, h, WHITE, MSO_SHAPE.ROUNDED_RECTANGLE, LINE); box.adjustments[0] = 0.03
    rect(s, x, y, colw, Mm(22), PURPLE if idx % 2 else CYAN, MSO_SHAPE.ROUNDED_RECTANGLE).adjustments[0] = 0.3
    text(s, x + Mm(10), y + Mm(3), colw - Mm(20), Mm(16), title, 44, WHITE, True)
    text(s, x + Mm(10), y + Mm(32), colw - Mm(20), h - Mm(40), hint, 32, MUTED, italic=True)

rect(s, 0, H - Mm(40), W, Mm(40), NAVY)
text(s, M, H - Mm(31), Mm(400), Mm(20), "DataVerse 2K27  •  Dept. of Basic Science & Humanities, IEM Kolkata  •  Society for Data Science, IEM Student Chapter", 24, RGBColor(0xCB, 0xD5, 0xE1))
text(s, W - M - Mm(140), H - Mm(31), Mm(140), Mm(20), "@dataverse.2k27", 28, GOLD, True, align=PP_ALIGN.RIGHT)
prs.save(f"{OUT}/Poster_Template_A1_DataVerse2K27.pptx")

# ---------- A4 size guide ----------
g = Presentation()
g.slide_width, g.slide_height = Mm(210), Mm(297)
GW = g.slide_width
s = g.slides.add_slide(g.slide_layouts[6])
rect(s, 0, 0, GW, Mm(62), NAVY)
rect(s, 0, Mm(62), GW, Mm(1.5), CYAN)
logos(s, GW - Mm(12), Mm(10), Mm(20), Mm(4))
text(s, Mm(12), Mm(12), Mm(120), Mm(8), "DATAVERSE 2K27  •  POSTER PRESENTATION", 11, CYAN, True)
text(s, Mm(12), Mm(32), Mm(186), Mm(14), "Poster Size & Format Guide", 26, WHITE, True)
text(s, Mm(12), Mm(48), Mm(186), Mm(8), "Every participant must follow this guide and the official template.", 11, RGBColor(0xCB, 0xD5, 0xE1), italic=True)

ROWS = [
    ("Size", "A1 — 594 mm × 841 mm (23.4 in × 33.1 in)"),
    ("Orientation", "Portrait (vertical)"),
    ("File format", "Edit the official .pptx template; submit / print as PDF"),
    ("Resolution", "Images at least 150 DPI (300 DPI preferred)"),
    ("Title font", "80–100 pt, bold"),
    ("Section headings", "40–48 pt, bold"),
    ("Body text", "28–36 pt (readable from 1.5 m away)"),
    ("Logos", "IEM and UEM logos must stay in the top-right corner"),
    ("Sections", "Introduction, Objective, Data & Methodology, Results & Analysis, Conclusion, References"),
    ("Word limit", "Around 600–800 words in total — use charts instead of long text"),
]
y = Mm(74)
for i, (k, v) in enumerate(ROWS):
    rect(s, Mm(12), y, Mm(186), Mm(17), RGBColor(0xF1, 0xF5, 0xF9) if i % 2 == 0 else WHITE)
    text(s, Mm(16), y + Mm(3.5), Mm(44), Mm(12), k, 11, PURPLE, True)
    text(s, Mm(62), y + Mm(3.5), Mm(132), Mm(12), v, 11, INK)
    y += Mm(17)
tf = text(s, Mm(12), y + Mm(6), Mm(186), Mm(30), "Do's & Don'ts", 13, INK, True)
for line in ["DO:  Keep the header, footer and logos exactly as in the template.",
             "DO:  Use high-contrast colours and label every chart.",
             "DON'T:  Change the poster size or orientation.",
             "DON'T:  Use plagiarised content — cite all data sources."]:
    add_line(tf, line, 10.5, INK, before=3)
rect(s, 0, Mm(285), GW, Mm(12), NAVY)
text(s, Mm(12), Mm(287), Mm(186), Mm(8), "DataVerse 2K27  •  13–14 Feb 2027  •  IEM Kolkata  •  dataverse2k27@gmail.com", 9, RGBColor(0xCB, 0xD5, 0xE1))
guide = f"{OUT}/Poster_Size_Guide_DataVerse2K27.pptx"
g.save(guide)
subprocess.run(["soffice", "--headless", "--convert-to", "pdf", guide, "--outdir", OUT], check=True, capture_output=True)
subprocess.run(["rm", guide], check=True)
print("done")
