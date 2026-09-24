from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
import os

pdf_path = r"E:\portfolio 90\assets\resume.pdf"
os.makedirs(os.path.dirname(pdf_path), exist_ok=True)

doc = SimpleDocTemplate(
    pdf_path,
    pagesize=letter,
    leftMargin=36,
    rightMargin=36,
    topMargin=36,
    bottomMargin=36
)

styles = getSampleStyleSheet()

# Colors
primary_dark = colors.HexColor("#0f172a")
accent_rose = colors.HexColor("#e11d48")
slate_text = colors.HexColor("#334155")
muted_gray = colors.HexColor("#64748b")
card_bg = colors.HexColor("#f8fafc")
card_border = colors.HexColor("#e2e8f0")

title_style = ParagraphStyle(
    'DocTitle',
    parent=styles['Heading1'],
    fontName='Helvetica-Bold',
    fontSize=22,
    leading=26,
    textColor=primary_dark,
    spaceAfter=2
)

subtitle_style = ParagraphStyle(
    'DocSubtitle',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=10,
    leading=13,
    textColor=accent_rose,
    spaceAfter=4
)

contact_style = ParagraphStyle(
    'ContactInfo',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=8.5,
    leading=12,
    textColor=muted_gray,
    alignment=TA_RIGHT
)

section_heading = ParagraphStyle(
    'SectionHeading',
    parent=styles['Heading2'],
    fontName='Helvetica-Bold',
    fontSize=11,
    leading=14,
    textColor=accent_rose,
    spaceBefore=8,
    spaceAfter=4
)

body_text = ParagraphStyle(
    'BodyTextCustom',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=8.5,
    leading=12,
    textColor=slate_text
)

item_title = ParagraphStyle(
    'ItemTitle',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=9,
    leading=12,
    textColor=primary_dark
)

item_meta = ParagraphStyle(
    'ItemMeta',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=8,
    leading=12,
    textColor=muted_gray,
    alignment=TA_RIGHT
)

tag_style = ParagraphStyle(
    'TagStyle',
    parent=styles['Normal'],
    fontName='Helvetica-Oblique',
    fontSize=7.5,
    leading=10,
    textColor=accent_rose
)

story = []

# Header Table
header_data = [
    [
        Paragraph("<b>ADITYA SONI</b>", title_style),
        Paragraph("mradityasoni.cse@gmail.com<br/>+91 93018 73385 &bull; Bhilai, India<br/>github.com/mradityasonicse", contact_style)
    ],
    [
        Paragraph("SYSTEMS BUILDER &bull; FULL-STACK DEVELOPER &bull; CREATIVE TECHNOLOGIST", subtitle_style),
        ""
    ]
]
t_header = Table(header_data, colWidths=[360, 180])
t_header.setStyle(TableStyle([
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('SPAN', (0,1), (1,1)),
    ('BOTTOMPADDING', (0,0), (-1,-1), 1),
    ('TOPPADDING', (0,0), (-1,-1), 0),
]))
story.append(t_header)
story.append(Spacer(1, 4))
story.append(HRFlowable(width="100%", thickness=1, color=card_border, spaceBefore=2, spaceAfter=8))

# Summary
story.append(Paragraph("EXECUTIVE SUMMARY", section_heading))
story.append(Paragraph(
    "High-performance full-stack engineer and systems architect specializing in real-time WebSockets, "
    "low-latency distributed microservices, and hardware-accelerated 3D WebGL interfaces. Proven track record "
    "in building sub-millisecond telemetry pipelines, Raft consensus queues, and zero-stutter 120 FPS web architectures.",
    body_text
))
story.append(Spacer(1, 6))

# Technical Competencies
story.append(Paragraph("TECHNICAL EXPERTISE", section_heading))
skills_data = [
    [
        Paragraph("<b>Languages & Core:</b>", item_title),
        Paragraph("TypeScript, JavaScript (ESNext), Go (Golang), Rust, Python, SQL, C/C++", body_text)
    ],
    [
        Paragraph("<b>Frontend & Graphics:</b>", item_title),
        Paragraph("React 19, Next.js 15, WebGL 2.0, Three.js, GLSL Fragment Shaders, Tailwind CSS, Canvas 2D", body_text)
    ],
    [
        Paragraph("<b>Systems & Infrastructure:</b>", item_title),
        Paragraph("Node.js, WebSockets, gRPC, Protobuf, Redis Pub/Sub, Docker, PostgreSQL, Linux, Git", body_text)
    ]
]
t_skills = Table(skills_data, colWidths=[120, 420])
t_skills.setStyle(TableStyle([
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('TOPPADDING', (0,0), (-1,-1), 2),
    ('BOTTOMPADDING', (0,0), (-1,-1), 2),
]))
story.append(t_skills)
story.append(Spacer(1, 6))

# Featured Projects
story.append(Paragraph("FEATURED ENGINEERING PROJECTS", section_heading))

projects = [
    (
        "PulseStream &mdash; Distributed Real-Time Telemetry Engine",
        "Go &bull; Redis &bull; Protobuf &bull; WebSockets",
        "Engineered a distributed telemetry engine handling 100,000+ serialized msgs/sec with binary Protobuf socket brokers, achieving 0.8ms P99 packet latency and multi-threaded Web Worker offloading for 120 FPS canvas blitting."
    ),
    (
        "Hyperion &mdash; Volumetric 3D Raymarcher & GLSL Shaders",
        "WebGL 2.0 &bull; Three.js &bull; GLSL &bull; Linear Algebra",
        "Designed procedural atmospheric clouds and signed distance field (SDF) terrain rendered purely in GLSL fragment shaders at locked 120 FPS without loading external polygon meshes."
    ),
    (
        "Aditi &mdash; High-Density Video & Real-Time Collaboration",
        "React 19 &bull; WebSockets &bull; Next.js 15 &bull; Docker",
        "Architected multi-party conferencing platform with dynamic mesh video routing, sub-30ms signaling latency, and responsive room state orchestration."
    ),
    (
        "Aura &mdash; Fault-Tolerant Distributed Task Queue",
        "Rust &bull; Go &bull; Raft Consensus &bull; gRPC",
        "Implemented Raft consensus algorithm for cluster leader election, automated worker heartbeat recovery, and guarantee of exactly-once execution with 99.999% SLA."
    ),
    (
        "Vector Calligraphy & Identity Engine",
        "Canvas 2D &bull; Cubic Bezier Math &bull; SVG Geometry",
        "Developed procedural vector stroke synthesizer animating mathematical cubic bezier curves with pen-nib physics, multi-ink shaders, and cryptographic verification seal generation."
    )
]

for p_title, p_stack, p_desc in projects:
    t_proj = Table([
        [Paragraph(f"<b>{p_title}</b>", item_title), Paragraph(p_stack, item_meta)],
        [Paragraph(p_desc, body_text), ""]
    ], colWidths=[380, 160])
    t_proj.setStyle(TableStyle([
        ('SPAN', (0,1), (1,1)),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
    ]))
    story.append(t_proj)
    story.append(Spacer(1, 4))

# Education & Honors
story.append(Paragraph("EDUCATION & MILESTONES", section_heading))
edu_data = [
    [
        Paragraph("<b>B.Tech in Computer Science & Engineering (Core)</b> &bull; Rungta International Skills University", item_title),
        Paragraph("2026 &ndash; 2030", item_meta)
    ],
    [
        Paragraph("<b>Secondary School Certificate (Class 10th)</b> &bull; CBSE Board (Academic Excellence)", item_title),
        Paragraph("2024 &bull; 92.0%", item_meta)
    ]
]
t_edu = Table(edu_data, colWidths=[420, 120])
t_edu.setStyle(TableStyle([
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('TOPPADDING', (0,0), (-1,-1), 2),
    ('BOTTOMPADDING', (0,0), (-1,-1), 2),
]))
story.append(t_edu)

doc.build(story)
print(f"Resume PDF successfully generated at: {pdf_path}")
