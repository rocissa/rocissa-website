# RocISSA Website

The website for the Rochester Chapter of the Information Systems Security Association.  Built with [Eleventy](https://11ty.dev).

## Editing

Most of the site is built using simple markdown templates.  Layouts are in HTML.  While I generally prefer to keep all content out of layouts, the homepage.html layoout file does have some secondary content in it.

### Meetings

Meetings can be added by adding a markdown file to the `meetings` directory in the project's root.  Files should be named with the date of the meeting to make them easier to find within the filesystem.  When built, meeting pages will automatically be given URLs that are based on the title.

Each meeting file should have the following frontmatter.  Aside from the title, frontmatter is only used to filter, sort, and display meetings on the homepoage and the main meetings page.  The file's content is displayed on the meeting page.

The meeting frontmatter should look like this:

```
---
title: "Meeting title"  <-- A descripting title for the meeting (this will also be used for form the page URL, so it should be unique)
meeting_date: YYYY-MM-DD <-- The date the meeting is to happen
start_time: "HH:MM" <-- The time the meeting starts, used in the ical file (24-hour time)
end_time: "HH:MM" <-- The expected end time of the event, used in the ical file (24-hour time)
rsvp_link: "mailto:recipient@rocissa.org" <-- The RSVP address (email or web) for the event, used in the ical file and for RSVP links on upcoming events
location: Some Restaurant, Some Town <-- A brief description of where the meeting will be held; it will be used in summaries of the event, the full address should be included in the event body
teaser: A short description of the meeting. <-- Displayed in summaries on the homepage, meetings page, and in the ical file
---
```

Meetings will be automatically added to the "upcoming meetings" and "past meetings" lists based on the time the site is built.  Updating the site daily, via cron job or similar mechanism, will keep the event listing current.

## iCalendar

iCalendar (.ical) files will be generated for each event.  Upcoming events will display an "add to calendar" link to the ical file for that event to make it easy for members to add the event to their calendars.
