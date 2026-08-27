import json
import os
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_header_footer(num_pages)
            super().showPage()
        super().save()

    def draw_header_footer(self, page_count):
        self.saveState()
        # Top Header
        self.setStrokeColor(colors.HexColor("#334155"))
        self.setLineWidth(0.75)
        self.line(36, A4[1] - 36, A4[0] - 36, A4[1] - 36)
        
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#0284c7"))
        self.drawString(36, A4[1] - 28, "QUANTEXA 2026 HACKATHON")
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))
        self.drawRightString(A4[0] - 36, A4[1] - 28, "ADMIN TRACK REPORT")

        # Bottom Footer
        self.line(36, 45, A4[0] - 36, 45)
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))
        self.drawString(36, 32, "Confidential • Quantexa Organizing Committee")
        self.drawRightString(A4[0] - 36, 32, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()

def get_floor_name(team_id):
    tid = team_id.upper()
    if tid.startswith("NEX0") or tid.startswith("QTX0"):
        return "Ground Floor"
    elif tid.startswith("NEX1") or tid.startswith("QTX1"):
        return "First Floor"
    elif tid.startswith("NEX2") or tid.startswith("QTX2"):
        return "Second Floor"
    elif tid.startswith("NEX3") or tid.startswith("QTX3"):
        return "Online / Virtual"
    return "Main Venue"

def build_pdf(db_path, output_pdf_path, filter_track=None):
    with open(db_path, "r") as f:
        db = json.load(f)

    all_teams = db.get("teams", [])
    
    if filter_track == "Med-Tech":
        teams = sorted([t for t in all_teams if t.get("track") == "Med-Tech"], key=lambda x: x["id"])
    elif filter_track == "Cyber Security":
        teams = sorted([t for t in all_teams if t.get("track") == "Cyber Security"], key=lambda x: x["id"])
    else:
        teams = all_teams

    cyber_teams = sorted([t for t in teams if t.get("track") == "Cyber Security"], key=lambda x: x["id"])
    med_teams = sorted([t for t in teams if t.get("track") == "Med-Tech"], key=lambda x: x["id"])

    # Floor statistics
    floors = {}
    for t in teams:
        fl = get_floor_name(t["id"])
        if fl not in floors:
            floors[fl] = {"total": 0, "cyber": 0, "med": 0}
        floors[fl]["total"] += 1
        if t.get("track") == "Cyber Security":
            floors[fl]["cyber"] += 1
        else:
            floors[fl]["med"] += 1

    doc = SimpleDocTemplate(
        output_pdf_path,
        pagesize=A4,
        leftMargin=36,
        rightMargin=36,
        topMargin=48,
        bottomMargin=56,
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        "DocTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=18,
        leading=22,
        textColor=colors.HexColor("#0f172a"),
    )

    subtitle_style = ParagraphStyle(
        "DocSubTitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#475569"),
    )

    h2_style = ParagraphStyle(
        "Heading2Custom",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#0f172a"),
        spaceBefore=14,
        spaceAfter=6,
    )

    cell_style = ParagraphStyle(
        "CellText",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#1e293b"),
    )

    cell_bold = ParagraphStyle(
        "CellBold",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#0f172a"),
    )

    cell_cyber = ParagraphStyle(
        "CellCyber",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#6b21a8"),
    )

    cell_med = ParagraphStyle(
        "CellMed",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#047857"),
    )

    cell_header = ParagraphStyle(
        "CellHeader",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=8,
        leading=11,
        textColor=colors.white,
    )

    story = []

    # Title Banner Block
    doc_title = f"QUANTEXA 2026 — {filter_track.upper() if filter_track else 'TRACK DISTRIBUTION'} ADMIN REPORT"
    story.append(Paragraph(doc_title, title_style))
    story.append(Spacer(1, 4))
    now_str = datetime.now().strftime("%B %d, %Y • %I:%M %p")
    story.append(Paragraph(f"Official Event Summary Report • Generated on {now_str} • Total Teams: <b>{len(teams)}</b>", subtitle_style))
    story.append(Spacer(1, 10))

    # Metric Cards Table
    metric_data = [
        [
            Paragraph("<b>TOTAL TEAMS</b><br/><font size=16 color='#0f172a'><b>{}</b></font>".format(len(teams)), cell_style),
            Paragraph("<b>CYBER SECURITY</b><br/><font size=16 color='#6b21a8'><b>{}</b></font>".format(len(cyber_teams)), cell_style),
            Paragraph("<b>MED-TECH TRACK</b><br/><font size=16 color='#047857'><b>{}</b></font>".format(len(med_teams)), cell_style),
            Paragraph("<b>PARTICIPANTS</b><br/><font size=16 color='#0284c7'><b>~{}</b></font>".format(len(teams) * 4), cell_style),
        ]
    ]

    t_metrics = Table(metric_data, colWidths=[128, 134, 134, 126])
    t_metrics.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#cbd5e1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_metrics)
    story.append(Spacer(1, 14))

    # Helper function to generate team section table
    def create_team_table(team_list, section_title, header_bg_color, is_cyber_track=True):
        story_nodes = []
        story_nodes.append(Paragraph(f"{section_title} ({len(team_list)} Teams)", h2_style))
        
        table_data = [
            [
                Paragraph("S.No", cell_header),
                Paragraph("Team ID", cell_header),
                Paragraph("Team Name", cell_header),
                Paragraph("Team Leader Name", cell_header),
                Paragraph("Contact Phone", cell_header),
                Paragraph("Assigned Venue", cell_header),
            ]
        ]

        for idx, t in enumerate(team_list, start=1):
            fl = get_floor_name(t["id"])
            table_data.append([
                Paragraph(str(idx), cell_style),
                Paragraph(f"<b>{t['id']}</b>", cell_cyber if is_cyber_track else cell_med),
                Paragraph(t['name'], cell_bold),
                Paragraph(t.get('leaderName', 'N/A'), cell_style),
                Paragraph(t.get('leaderPhone', 'N/A'), cell_style),
                Paragraph(fl, cell_style),
            ])

        t_section = Table(table_data, colWidths=[32, 64, 140, 126, 85, 75])
        t_section.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), header_bg_color),
            ('GRID', (0,0), (-1,-1), 0.4, colors.HexColor("#e2e8f0")),
            ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f8fafc")]),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ('LEFTPADDING', (0,0), (-1,-1), 5),
            ('RIGHTPADDING', (0,0), (-1,-1), 5),
        ]))
        story_nodes.append(t_section)
        return story_nodes

    if filter_track == "Med-Tech":
        story.extend(create_team_table(med_teams, "Med-Tech Track Master Roster", colors.HexColor("#065f46"), is_cyber_track=False))
    elif filter_track == "Cyber Security":
        story.extend(create_team_table(cyber_teams, "Cyber Security Track Master Roster", colors.HexColor("#581c87"), is_cyber_track=True))
    else:
        # Venue Summary Table
        story.append(Paragraph("1. Venue & Floor-wise Track Distribution", h2_style))
        floor_table_data = [
            [
                Paragraph("Venue / Location", cell_header),
                Paragraph("Team ID Prefix", cell_header),
                Paragraph("Cyber Security", cell_header),
                Paragraph("Med-Tech", cell_header),
                Paragraph("Total Teams", cell_header),
                Paragraph("Track Ratio", cell_header),
            ]
        ]

        prefix_map = {
            "Ground Floor": "QTX0001 / NEX0001 - QTX0046 / NEX0046",
            "First Floor": "QTX1001 / NEX1001 - QTX1047 / NEX1047",
            "Second Floor": "QTX2001 / NEX2001 - QTX2058 / NEX2058",
            "Online / Virtual": "QTX3001 / NEX3001 - QTX3023 / NEX3023",
        }

        for fl_name, counts in floors.items():
            ratio = f"{counts['cyber']} / {counts['med']}"
            floor_table_data.append([
                Paragraph(fl_name, cell_bold),
                Paragraph(prefix_map.get(fl_name, "Various"), cell_style),
                Paragraph(str(counts['cyber']), cell_cyber),
                Paragraph(str(counts['med']), cell_med),
                Paragraph(f"<b>{counts['total']}</b>", cell_bold),
                Paragraph(ratio, cell_style),
            ])

        floor_table_data.append([
            Paragraph("<b>GRAND TOTAL</b>", cell_bold),
            Paragraph("<b>ALL VENUES</b>", cell_bold),
            Paragraph(f"<b>{len(cyber_teams)}</b>", cell_cyber),
            Paragraph(f"<b>{len(med_teams)}</b>", cell_med),
            Paragraph(f"<b>{len(teams)}</b>", cell_bold),
            Paragraph("<b>50% / 50%</b>", cell_bold),
        ])

        t_floors = Table(floor_table_data, colWidths=[110, 110, 80, 75, 75, 72])
        t_floors.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#1e293b")),
            ('BACKGROUND', (0,-1), (-1,-1), colors.HexColor("#f1f5f9")),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('TOPPADDING', (0,0), (-1,-1), 5),
            ('BOTTOMPADDING', (0,0), (-1,-1), 5),
            ('LEFTPADDING', (0,0), (-1,-1), 6),
            ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ]))
        story.append(t_floors)
        story.append(Spacer(1, 16))
        story.append(PageBreak())
        story.extend(create_team_table(cyber_teams, "2. Cyber Security Track Master Roster", colors.HexColor("#581c87"), is_cyber_track=True))
        story.append(PageBreak())
        story.extend(create_team_table(med_teams, "3. Med-Tech Track Master Roster", colors.HexColor("#065f46"), is_cyber_track=False))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF Successfully generated at: {output_pdf_path}")

if __name__ == "__main__":
    db_file = "./data/final_db.json"
    
    # Combined PDF
    build_pdf(db_file, "./public/uploads/Quantexa_Admin_Track_Report.pdf")
    build_pdf(db_file, "./Quantexa_Admin_Track_Report.pdf")

    # Med-Tech PDF
    build_pdf(db_file, "./public/uploads/Quantexa_MedTech_Track_Report.pdf", filter_track="Med-Tech")
    build_pdf(db_file, "./Quantexa_MedTech_Track_Report.pdf", filter_track="Med-Tech")

    # Cyber Security PDF
    build_pdf(db_file, "./public/uploads/Quantexa_CyberSecurity_Track_Report.pdf", filter_track="Cyber Security")
    build_pdf(db_file, "./Quantexa_CyberSecurity_Track_Report.pdf", filter_track="Cyber Security")
