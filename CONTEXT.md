
⸻

BASKET WEAVING PATTERN DESIGN AND WEAVING ASSISTANT
WEB APPLICATION – FULL PROJECT CONTEXT

⸻

	1.	PROJECT OVERVIEW

This project is a web-based basket weaving pattern design and weaving assistant.

The purpose of the website is to help a real basket weaver design weaving patterns and then follow correct, step-by-step weaving instructions while weaving an actual basket.

The website is not just a visual pattern editor.
It is a practical weaving assistant that translates a designed pattern into correct physical weaving actions that can be followed during real basket weaving.

The system runs as a web application and is intended to be usable on tablets, laptops, or desktop browsers while weaving.

⸻

	2.	PHYSICAL WEAVING ASSUMPTIONS

The basket already has vertical axes (stakes) prepared before weaving begins.

These vertical axes:
	•	Are fixed in number
	•	Are evenly spaced
	•	Are arranged in a circular shape

The user can choose the number of vertical axes before designing the pattern.

In the web interface, vertical axes are represented horizontally like columns in an Excel sheet, even though they form a circle in real life.

Weaving is done using horizontal strips.
The basket is woven from the bottom upward, one horizontal strip at a time.
Each strip corresponds to one complete weaving round around the basket.

⸻

	3.	GRID-BASED PATTERN DESIGN (WEB INTERFACE)

The pattern is designed using an Excel-like grid displayed on the web page.

Columns represent vertical axes.
Rows represent weaving rounds from bottom to top.

Each cell can be colored or uncolored using mouse or touch input.

A colored cell means the vertical axis must be covered by the weaving strip and be visible.
An uncolored cell means the weaving strip must pass behind the vertical axis.

⸻

	4.	PATTERN IS DEFINED BY RANGES, NOT POINTS

Weaving logic is based on continuous ranges of vertical axes, not individual axes.

A group of adjacent colored cells means the weaving strip must cover the entire range in a single insertion.

A colored cell does not represent a start point.
It represents that the vertical axis must be covered as part of a continuous range.

⸻

	5.	CENTER AXIS CONCEPT

There is a logical center axis, referred to as C.

The center axis is a conceptual reference used to:
	•	Divide left and right directions
	•	Determine strip initialization rules

The center axis is not necessarily a physical start or end of the weaving strip.

⸻

	6.	STRIP INITIALIZATION RULES (CRITICAL)

Each weaving row has a strip initialization rule that determines how the weaving strip enters and exits before continuing.

If the colored range includes the center axis, the strip must be inserted before the leftmost colored axis and exit after the rightmost colored axis of that range.

If the colored range does not include the center axis, the strip must start from inside the basket.
In this case, the strip exits after the left colored axis and re-enters before the right colored axis.

The strip starting position depends on how colored ranges relate to the center axis, not on a fixed position.

⸻

	7.	LEFT AND RIGHT WEAVING DIRECTIONS

After strip initialization, weaving proceeds in two independent directions.

The left direction is processed continuously from the center toward the left end.
The right direction is processed continuously from the center toward the right end.

The system must not alternate between left and right while generating instructions.
Each side is processed independently.

At the end of each weaving round, the left and right parts of the strip meet at the back of the basket.

⸻

	8.	WEAVING INSTRUCTION GENERATION

For each weaving row, the system generates human-readable weaving instructions.

Instructions are expressed as sequences such as:
cover a number of vertical axes, then skip a number of vertical axes.

Instructions are generated separately for the left side and the right side.

These instructions are derived from continuous colored and uncolored ranges in the pattern.

⸻

	9.	WEAVING MODE (WEB EXECUTION MODE)

After the user confirms the pattern, the website enters weaving mode.

In weaving mode:
	•	The user is guided from the bottom row to the top row
	•	One weaving round is shown at a time
	•	Instructions for the current row are clearly displayed

The current row is visually highlighted on the grid.

⸻

	10.	FLEXIBILITY AND ERROR RECOVERY

The website must support flexible navigation.

The user can:
	•	Select any weaving row
	•	Move backward or forward between rows
	•	Redo completed rows if mistakes occur

The system must allow correcting errors without restarting the entire project.

Each row has a status such as not started, in progress, completed, or reworked.

⸻

	11.	USER-CONFIGURABLE SETTINGS

Before confirming the pattern, the user can configure:
	•	Number of vertical axes
	•	Number of weaving rows
	•	Colors used in the pattern

The pattern can be freely designed using the grid.

⸻

	12.	OVERALL WEBSITE FLOW

The overall workflow of the website is:

Start the website
Design the pattern
Confirm the pattern
Weave from bottom to top with full navigation and correction support
Finish when the top row is completed

⸻

	13.	CORE PHILOSOPHY

The core philosophy of this project is to respect real basket weaving logic.

The website is designed to preserve traditional weaving knowledge while making it easier to design, understand, and correctly execute complex weaving patterns in real-world use.

⸻
