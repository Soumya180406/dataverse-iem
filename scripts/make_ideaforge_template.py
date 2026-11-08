from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN

IMG = "/app/frontend/public/images"
OUT = "/app/frontend/public/downloads/Ideaforge_PPT_Template_DataVerse2K27.pptx"
NAVY, CARD, CYAN, PURPLE, GOLD, WHITE, MUTED = (RGBColor(0x05, 0x07, 0x0E), RGBColor(0x0F, 0x17, 0x2A),
    RGBColor(0x06, 0xB6, 0xD4), RGBColor(0x8B, 0x5C, 0xF6), RGBColor(0xF5, 0x9E, 0x0B), RGBColor(0xFF, 0xFF, 0xFF),
    RGBColor(0x94, 0xA3, 0xB8))

SLIDES = [
    ("Problem Statement", ["What real-world problem are you solving?", "Who is affected and how big is the problem?",
                           "Support it with 1–2 data points or facts (cite the source)."]),
    ("Proposed Solution", ["Describe your idea in 2–3 lines.", "What makes it new or better than existing solutions?",
                           "Add a simple diagram or flow if helpful."]),
    ("Data & Methodology", ["Which data will you use and where does it come from?",
                            "Which analysis / ML / AI techniques will you apply?", "Show the workflow: Data → Model → Output."]),
    ("Impact & Feasibility", ["Expected impact — social, economic or environmental.",
                              "Tools, cost and timeline needed to build it.", "Key risks and how you will handle them."]),
]

prs = Presentation()
prs.slide_width, prs.slide_height = Inches(13.333), Inches(7.5)
W, H = prs.slide_width, prs.slide_height
blank = prs.slide_layouts[6]


def rect(s, x, y, w, h, color, shape=MSO_SHAPE.RECTANGLE):
    r = s.shapes.add_shape(shape, x, y, w, h)
    r.fill.solid(); r.fill.fore_color.rgb = color; r.line.fill.background()
    return r


def text(s, x, y, w, h, value, size, color=WHITE, bold=False, italic=False, align=PP_ALIGN.LEFT, font="Calibri"):
    tb = s.shapes.add_textbox(x, y, w, h); tf = tb.text_frame; tf.word_wrap = True
    p = tf.paragraphs[0]; p.alignment = align
    r = p.add_run(); r.text = value; f = r.font
    f.size, f.bold, f.italic, f.name = Pt(size), bold, italic, font; f.color.rgb = color
    return tf


def logos(s, y=Inches(0.3), h=Inches(0.85)):
    w = Inches(1.35)
    for i, k in enumerate(["iem", "uem"]):
        x = W - Inches(0.4) - (2 - i) * w - (1 - i) * Inches(0.15)
        rect(s, x, y, w, h, WHITE, MSO_SHAPE.ROUNDED_RECTANGLE).adjustments[0] = 0.12
        from PIL import Image
        iw, ih = Image.open(f"{IMG}/logo_{k}.png").size
        ph = h - Inches(0.12)
        s.shapes.add_picture(f"{IMG}/logo_{k}.png", x + (w - int(ph * iw / ih)) // 2, y + Inches(0.06), height=ph)


def base(n):
    s = prs.slides.add_slide(blank)
    rect(s, 0, 0, W, H, NAVY)
    rect(s, 0, 0, Inches(0.12), H, CYAN)
    rect(s, 0, H - Inches(0.5), W, Inches(0.5), CARD)
    text(s, Inches(0.5), H - Inches(0.45), Inches(8), Inches(0.4), "DataVerse 2K27  •  Ideaforge  •  Compete • Analyze • Conquer", 11, MUTED)
    text(s, W - Inches(3), H - Inches(0.45), Inches(2.6), Inches(0.4), f"Slide {n} / 6", 11, GOLD, True, align=PP_ALIGN.RIGHT)
    logos(s)
    return s


# 1. Title
s = base(1)
text(s, Inches(0.7), Inches(1.6), Inches(9), Inches(0.5), "DATAVERSE 2K27  •  IDEAFORGE — IDEA PITCH COMPETITION", 14, CYAN, True)
text(s, Inches(0.7), Inches(2.3), Inches(11.5), Inches(1.4), "[Your Idea Title]", 48, WHITE, True)
text(s, Inches(0.7), Inches(3.7), Inches(11), Inches(0.6), "[One-line tagline describing your idea]", 20, MUTED, italic=True)
rect(s, Inches(0.7), Inches(4.6), Inches(6.8), Inches(1.7), CARD, MSO_SHAPE.ROUNDED_RECTANGLE).adjustments[0] = 0.08
tf = text(s, Inches(0.95), Inches(4.75), Inches(6.4), Inches(1.5), "Participant: [Full Name]", 16, WHITE, True)
for line in ["Registration name on Google Form: [Name]", "College / Department: [College, Dept]", "Year: [Year]   •   Contact: [Email]"]:
    p = tf.add_paragraph(); r = p.add_run(); r.text = line; r.font.size = Pt(14); r.font.color.rgb = MUTED; r.font.name = "Calibri"
text(s, Inches(8.2), Inches(5.6), Inches(4.6), Inches(0.6), "13–14 February 2027  •  IEM Kolkata", 14, GOLD, True, align=PP_ALIGN.RIGHT)

# 2–5. Content
for i, (title, hints) in enumerate(SLIDES, start=2):
    s = base(i)
    text(s, Inches(0.7), Inches(0.45), Inches(8.5), Inches(0.4), f"0{i - 1}  /  IDEAFORGE", 12, PURPLE, True)
    text(s, Inches(0.7), Inches(0.8), Inches(8.5), Inches(0.9), title, 36, WHITE, True)
    rect(s, Inches(0.7), Inches(1.75), Inches(1.4), Inches(0.06), GOLD)
    box = rect(s, Inches(0.7), Inches(2.1), Inches(11.9), Inches(4.6), CARD, MSO_SHAPE.ROUNDED_RECTANGLE)
    box.adjustments[0] = 0.04
    tf = text(s, Inches(1.0), Inches(2.35), Inches(11.3), Inches(4.2), "Replace the guidance below with your content:", 14, CYAN, True)
    for h in hints:
        p = tf.add_paragraph(); p.space_before = Pt(14)
        r = p.add_run(); r.text = f"•  [{h}]"; r.font.size = Pt(20); r.font.color.rgb = MUTED; r.font.italic = True; r.font.name = "Calibri"

# 6. Conclusion
s = base(6)
text(s, Inches(0.7), Inches(0.45), Inches(8.5), Inches(0.4), "05  /  IDEAFORGE", 12, PURPLE, True)
text(s, Inches(0.7), Inches(0.8), Inches(8.5), Inches(0.9), "Conclusion & Thank You", 36, WHITE, True)
rect(s, Inches(0.7), Inches(1.75), Inches(1.4), Inches(0.06), GOLD)
tf = text(s, Inches(0.7), Inches(2.2), Inches(11.5), Inches(2.6), "Key takeaways", 18, CYAN, True)
for h in ["[3 short points: the problem, your solution, the impact]", "[Next steps if you win / future scope]", "[References / data sources]"]:
    p = tf.add_paragraph(); p.space_before = Pt(12)
    r = p.add_run(); r.text = f"•  {h}"; r.font.size = Pt(18); r.font.color.rgb = MUTED; r.font.italic = True; r.font.name = "Calibri"
text(s, Inches(0.7), Inches(5.2), Inches(11.9), Inches(1.0), "Thank You!", 44, GOLD, True, align=PP_ALIGN.CENTER)
text(s, Inches(0.7), Inches(6.2), Inches(11.9), Inches(0.5), "From Data to Impact — Innovate. Analyze. Transform.", 14, MUTED, italic=True, align=PP_ALIGN.CENTER)

prs.save(OUT)
print("saved", OUT, len(prs.slides._sldIdLst), "slides")
