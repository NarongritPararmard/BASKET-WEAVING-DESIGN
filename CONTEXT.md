
⸻

BASKET WEAVING DESIGN AND WEAVING ASSISTANT APP
FULL PROJECT CONTEXT

⸻

	1.	PROJECT OVERVIEW

This project is a basket weaving design and execution assistant application.
The purpose of the app is to help a real basket weaver design weaving patterns and then follow correct, step-by-step weaving instructions while weaving an actual basket.

The app is not only a visual pattern editor. It is a practical assistant that translates a designed pattern into correct physical weaving actions that can be followed during real basket weaving.

⸻

	2.	PHYSICAL WEAVING ASSUMPTIONS

The basket already has vertical axes (stakes) prepared before weaving begins.
These vertical axes are fixed in number, evenly spaced, and arranged in a circular shape.

The user can choose the number of vertical axes.
In the app, vertical axes are represented horizontally like columns in an Excel sheet, even though they form a circle in real life.

Weaving is done using horizontal strips.
The basket is woven from the bottom upward, one strip at a time.
Each strip corresponds to one complete weaving round around the basket.

⸻

	3.	GRID-BASED PATTERN DESIGN

The pattern is designed using an Excel-like grid.

Columns represent vertical axes.
Rows represent weaving rounds from bottom to top.

Each cell can be either colored or uncolored.

A colored cell means the vertical axis must be covered by the weaving strip and be visible.
An uncolored cell means the weaving strip must pass behind the vertical axis.

⸻

	4.	PATTERN IS DEFINED BY RANGES, NOT POINTS

Weaving is based on continuous ranges of vertical axes, not individual axes.

A group of adjacent colored cells means the weaving strip must cover the entire range in a single insertion.

A colored cell does not indicate a specific insertion point.
It indicates that the axis must be covered as part of a continuous range.

⸻

	5.	CENTER AXIS CONCEPT

There is a logical center axis, referred to as C.
This center axis is used only as a reference point for reading and interpreting the pattern.

The center axis is not necessarily the physical starting point of weaving.
It is a conceptual anchor for determining left and right directions.

⸻

	6.	STRIP INITIALIZATION RULES

Each weaving round has a strip initialization rule.
This rule determines where the weaving strip enters and exits before continuing left and right.

If the colored range includes the center axis, the strip must be inserted before the leftmost colored axis and exit after the rightmost colored axis of that range.

If the colored range does not include the center axis, the strip must start from inside the basket.
In this case, the strip exits after the left colored axis and re-enters before the right colored axis.

The starting position of a strip depends on how the colored ranges relate to the center axis, not on a fixed starting location.

⸻

	7.	LEFT AND RIGHT WEAVING DIRECTIONS

After strip initialization, weaving proceeds in two independent directions: left and right.

The left side is processed continuously from the center toward the left end.
The right side is processed continuously from the center toward the right end.

The app must not alternate between left and right while generating instructions.
Each side is processed independently.

At the end of a weaving round, the left and right parts of the strip meet at the back of the basket.

⸻

	8.	WEAVING INSTRUCTION GENERATION

For each weaving row, the app generates clear, human-readable weaving instructions.

Instructions are expressed as sequences such as:
cover a number of vertical axes, then skip a number of vertical axes.

Instructions are generated separately for the left side and the right side.

These instructions are derived from continuous colored and uncolored ranges in the pattern.

⸻

	9.	WEAVING MODE AND EXECUTION

After the user confirms the pattern, the app enters weaving mode.

Weaving mode guides the user from the bottom row to the top row, one weaving round at a time.

The current row is clearly indicated, and its corresponding instructions are shown.

⸻

	10.	FLEXIBILITY AND ERROR RECOVERY

The app must be flexible and forgiving.

The user can select any weaving row at any time.
The user can move backward or forward between rows.
Completed rows can be reworked if mistakes occur.

The app must support correcting errors without forcing the user to restart the entire basket.

Each row has a state such as not started, in progress, completed, or reworked.

⸻

	11.	USER-CONFIGURABLE SETTINGS

Before confirming the pattern, the user can configure:
the number of vertical axes,
the number of weaving rows,
and the colors used in the pattern.

The user can freely design patterns using the grid.

⸻

	12.	OVERALL APPLICATION FLOW

The overall workflow of the application is:

Start the app
Design the pattern
Confirm the pattern
Weave from bottom to top with full navigation and correction support
Finish when the top row is completed

⸻

	13.	CORE PHILOSOPHY

The core philosophy of this project is to respect real basket weaving logic.

The app is designed to preserve traditional weaving knowledge while making it easier to design, understand, and execute complex patterns correctly in real-world use.

⸻
