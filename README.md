# 3xt (wip name)

### 3xt seeks to be an open-source all-in-one organization, notebook, productivity app.

3xt allows you to work within three distinct formats:
- Note Pages
- Boards
- Widget Pages

### Notes Pages
Note pages or notes allow you to take notes, make documents, plan projects, etc.
Notes are saved as markdown files (.md) and use our modified markdown syntax for formatting.

**Links**<br>
Links allow you to link to different note pages, boards (see Boards), widget pages (see Widget Pages), specific sections of note pages, board items (see Board Items), or a specific widget in a widget page (see Widgets), as well as links to websites.

**Tags**<br>
Notes can have different tags (see Tags) attached to them, and be sorted by it's tags.

### Boards
Boards allow you to make different collections of board items, which are either images or videos.

**Board items**<br>
Board items are images or videos inside of a board, along with being an image or video items can have further context (see Context) attached.

**Context**<br>
Items can have context attached to them, these are a title, description, links, board, tags, and audio files attached.
All items must have a title and a board attached, all other attached context is optional.

**Links**<br>
Links allow you to link to different board items, note pages, boards, widget pages, specific sections of note pages, or a specific widget in a widget page (see Widget Pages), as well as links to websites.

**Tags**<br>
Both items and boards can have tags (see Tags) attached to them, and be sorted by it's tags.

### Widgets Pages
Widget pages allow you to construct a bento grid of different widgets (see Widgets).

**Widgets**<br>
Widgets are components that preform a specific role.
3xt has 10 widgets built in: 
- Date & time
	- Can list a single timezone or multiple timezones.
	- Can use the device time or source time zones from the internet.
- Weather
	- Lists the temperature in Fahrenheit or Celsius.
	- Can list the weekly or daily weather forecast.
	- Can use the device time or latitude and longitude. 
- Text
	- Simple text box.
	- Formatted with markdown syntax.
- List
	- Ordered or unordered list of either text, or links.
- Check box list
	- Can be used to make a to-do list, task list, etc.
	- Can automatically reset boxes or all list entries, either daily, weekly, or monthly.
- Kanban
	- Kanban styled organizational tool.
	- Six different categories: un-started, planning, pre-review, started, post-review, finished.
- Embed
	- Embed links, HTML, images, or videos.
- Calendar
	- Simple calendar.
- Table
	- Simple table.
- Pomodoro timer
	- 25 minute focus intervals.
	- 5 minute breaks.

### Tags
To help you stay organized 3xt allows you to add tags to all pages, boards, and board items.

**Categories**<br>
There are six hardcoded tag categories: type, medium, aesthetic, industry, location, project. You are also able to create your own custom tag categories.
### Appearance
**Default**<br>
3xt's default theme aims to achieve a tui terminal inspired appearance.
3xt's default color palette is dark with subtle accents purple accents.
3xt's default font is JetBrains Mono.

**Custom**<br>
Built on electron 3xt will be highly customizable via the preset themes, fonts, and color palettes, or through custom css.