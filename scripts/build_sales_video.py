from __future__ import annotations

import asyncio
import subprocess
import sys
from pathlib import Path

SHARED_PYDEPS = Path(__file__).resolve().parents[3] / "tmp" / "upwork-video" / "pydeps"
sys.path.insert(0, str(SHARED_PYDEPS))

import edge_tts
import imageio_ffmpeg
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[1]
WORKSPACE = ROOT.parents[1]
WORK = WORKSPACE / "tmp" / "growthdesk-video"
FRAMES = WORK / "frames"
ASSETS = ROOT / "sales-assets"
OUTPUT = ASSETS / "GrowthDesk-Marketplace-Demo.mp4"
NARRATION = ASSETS / "GrowthDesk-Marketplace-Narration.mp3"
SUBTITLES = ASSETS / "GrowthDesk-Marketplace-Narration.srt"
FRAMES.mkdir(parents=True, exist_ok=True)

WIDTH, HEIGHT = 1280, 720
BG = "#07110B"
PANEL = "#14241A"
CREAM = "#F7F3E8"
MUTED = "#B3B9B2"
LIME = "#B9FF3B"
FOREST = "#0B2A19"
ORANGE = "#F38A42"
FONT_REGULAR = Path(r"C:\Windows\Fonts\segoeui.ttf")
FONT_SEMIBOLD = Path(r"C:\Windows\Fonts\seguisb.ttf")
VOICE = "en-US-EmmaMultilingualNeural"
NARRATION_TEXT = """Run your entire client-service business from one focused product with GrowthDesk.

GrowthDesk brings your customer website, AI-assisted enquiries, lead pipeline, inbox, follow-up automation, client delivery, reviews, and revenue reporting into one system.

Capture and qualify new opportunities, keep every next action visible, and move the right customers toward a booking.

Automations connect the full journey, from the first question to the final review request.

Every booked customer receives a clear branded portal with progress, decisions, files, deliverables, and invoice visibility.

Your team gets a production-ready operating system instead of scattered tools and manual handoffs.

Choose a package and launch GrowthDesk for your business with Noerong."""


def font(size: int, semibold: bool = False) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(FONT_SEMIBOLD if semibold else FONT_REGULAR), size)


def rounded_panel(canvas: Image.Image, box: tuple[int, int, int, int], radius: int = 26) -> None:
    shadow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow)
    x1, y1, x2, y2 = box
    shadow_draw.rounded_rectangle((x1 + 8, y1 + 12, x2 + 8, y2 + 12), radius, fill=(0, 0, 0, 115))
    canvas.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(14)))
    ImageDraw.Draw(canvas).rounded_rectangle(box, radius, fill=PANEL, outline="#31433A", width=2)


def brand_header(canvas: Image.Image, label: str) -> None:
    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle((48, 28, 92, 72), 13, fill=LIME)
    draw.text((56, 37), "GD", font=font(18, True), fill=FOREST)
    draw.text((108, 33), "GrowthDesk", font=font(25, True), fill=CREAM)
    pill_width = draw.textbbox((0, 0), label.upper(), font=font(15, True))[2] + 34
    draw.rounded_rectangle((WIDTH - 48 - pill_width, 34, WIDTH - 48, 66), 16, fill="#1A2A21", outline="#385043")
    draw.text((WIDTH - 48 - pill_width + 17, 40), label.upper(), font=font(15, True), fill=LIME)


def fit_scene(source: Path, target: Path, label: str, centering: tuple[float, float] = (0.5, 0.48)) -> None:
    canvas = Image.new("RGBA", (WIDTH, HEIGHT), BG)
    brand_header(canvas, label)
    box = (38, 84, WIDTH - 38, HEIGHT - 34)
    rounded_panel(canvas, box)
    shot = Image.open(source).convert("RGB")
    fitted = ImageOps.fit(shot, (1168, 574), method=Image.Resampling.LANCZOS, centering=centering)
    x = (WIDTH - fitted.width) // 2
    y = 100
    mask = Image.new("L", fitted.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, fitted.width, fitted.height), 18, fill=255)
    canvas.paste(fitted, (x, y), mask)
    canvas.convert("RGB").save(target, quality=95)


def make_title(target: Path) -> None:
    canvas = Image.new("RGBA", (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(canvas)
    for x in range(0, WIDTH, 80):
        draw.line((x, 0, x, HEIGHT), fill="#111C16", width=1)
    for y in range(0, HEIGHT, 80):
        draw.line((0, y, WIDTH, y), fill="#111C16", width=1)
    draw.rounded_rectangle((70, 70, 118, 118), 14, fill=LIME)
    draw.text((78, 80), "GD", font=font(20, True), fill=FOREST)
    draw.text((136, 76), "GROWTHDESK", font=font(23, True), fill=CREAM)
    draw.rounded_rectangle((70, 175, 250, 215), 20, fill="#18291F", outline="#385043")
    draw.ellipse((89, 189, 101, 201), fill=LIME)
    draw.text((113, 183), "LIVE PRODUCT", font=font(16, True), fill=LIME)
    draw.text((70, 255), "One operating system", font=font(58, True), fill=CREAM)
    draw.text((70, 323), "for your whole client journey.", font=font(52, True), fill=LIME)
    draw.text((72, 421), "Capture demand, deliver work, and grow repeat revenue", font=font(27), fill=MUTED)
    pills = ["LEADS", "AUTOMATIONS", "CLIENT PORTALS", "REVIEWS"]
    x = 70
    for pill in pills:
        width = draw.textbbox((0, 0), pill, font=font(15, True))[2] + 38
        draw.rounded_rectangle((x, 512, x + width, 552), 20, fill=PANEL, outline="#385043")
        draw.text((x + 19, 520), pill, font=font(15, True), fill="#D7DED9")
        x += width + 14
    canvas.convert("RGB").save(target, quality=95)


def make_outro(target: Path) -> None:
    canvas = Image.new("RGBA", (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(canvas)
    draw.ellipse((920, -140, 1320, 260), fill="#193222")
    draw.ellipse((-160, 520, 240, 920), fill="#332218")
    draw.rounded_rectangle((70, 70, 118, 118), 14, fill=LIME)
    draw.text((78, 80), "GD", font=font(20, True), fill=FOREST)
    draw.text((136, 76), "GROWTHDESK", font=font(23, True), fill=CREAM)
    draw.text((70, 213), "Turn scattered tools", font=font(58, True), fill=CREAM)
    draw.text((70, 281), "into one growth engine.", font=font(58, True), fill=LIME)
    draw.text((72, 388), "Ask  •  Capture  •  Deliver  •  Delight  •  Grow", font=font(27), fill=MUTED)
    draw.rounded_rectangle((70, 490, 455, 558), 34, fill=LIME)
    draw.text((108, 507), "CHOOSE A PACKAGE TO START", font=font(20, True), fill=FOREST)
    canvas.convert("RGB").save(target, quality=95)


async def create_narration() -> None:
    communicator = edge_tts.Communicate(NARRATION_TEXT, voice=VOICE, rate="-10%", volume="+0%", boundary="SentenceBoundary")
    subtitle_maker = edge_tts.SubMaker()
    with NARRATION.open("wb") as audio_file:
        async for message in communicator.stream():
            if message["type"] == "audio":
                audio_file.write(message["data"])
            elif message["type"] == "SentenceBoundary":
                subtitle_maker.feed(message)
    SUBTITLES.write_text(subtitle_maker.get_srt(), encoding="utf-8")


def render_video() -> Path:
    asyncio.run(create_narration())
    title = FRAMES / "00-title.png"
    website = FRAMES / "01-website.png"
    dashboard = FRAMES / "02-dashboard.png"
    pipeline = FRAMES / "03-pipeline.png"
    automations = FRAMES / "04-automations.png"
    portal = FRAMES / "05-portal.png"
    reviews = FRAMES / "06-reviews.png"
    outro = FRAMES / "07-outro.png"
    make_title(title)
    fit_scene(ASSETS / "01-product-website.png", website, "CUSTOMER WEBSITE", (0.5, 0.44))
    fit_scene(ASSETS / "02-command-center.png", dashboard, "COMMAND CENTER", (0.5, 0.45))
    fit_scene(ASSETS / "03-lead-pipeline.png", pipeline, "LEAD PIPELINE", (0.5, 0.42))
    fit_scene(ASSETS / "05-automations.png", automations, "CONNECTED AUTOMATIONS", (0.5, 0.45))
    fit_scene(ASSETS / "06-client-portal.png", portal, "PRIVATE CLIENT PORTAL", (0.5, 0.44))
    fit_scene(ASSETS / "07-review-system.png", reviews, "REVIEW WORKFLOW", (0.5, 0.45))
    make_outro(outro)

    scenes = [(title, 4.5), (website, 7.0), (dashboard, 7.0), (pipeline, 6.5), (automations, 6.5), (portal, 7.0), (reviews, 6.0), (outro, 10.5)]
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    command = [ffmpeg, "-y"]
    for path, duration in scenes:
        command.extend(["-loop", "1", "-t", f"{duration:.1f}", "-i", str(path)])
    command.extend(["-i", str(NARRATION)])
    filters: list[str] = []
    for index, (_, duration) in enumerate(scenes):
        fade_out = max(duration - 0.25, 0)
        filters.append(f"[{index}:v]fps=30,format=yuv420p,fade=t=in:st=0:d=0.25,fade=t=out:st={fade_out:.2f}:d=0.25,setpts=PTS-STARTPTS[v{index}]")
    joined = "".join(f"[v{i}]" for i in range(len(scenes)))
    filters.append(f"{joined}concat=n={len(scenes)}:v=1:a=0[base]")
    subtitle_path = SUBTITLES.relative_to(WORKSPACE).as_posix()
    filters.append("[base]subtitles=filename='" + subtitle_path + "':force_style='FontName=Segoe UI,FontSize=16,PrimaryColour=&H00FFFFFF,BackColour=&H78000000,OutlineColour=&H78000000,BorderStyle=3,Outline=1,Shadow=0,MarginL=90,MarginR=90,MarginV=18,Alignment=2'[vout]")
    audio_index = len(scenes)
    filters.append(f"[{audio_index}:a]apad=pad_dur=3[aout]")
    command.extend(["-filter_complex", ";".join(filters), "-map", "[vout]", "-map", "[aout]", "-t", "55.0", "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-r", "30", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", str(OUTPUT)])
    subprocess.run(command, cwd=WORKSPACE, check=True)
    return OUTPUT


if __name__ == "__main__":
    print(render_video())
