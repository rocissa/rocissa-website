---
title: Meetings
layout: page
section: meeting
eleventyNavigation:
  key: meetings
  title: Meetings
  class: meetings
  order: 1
---
{%- assign today = "now" | date: "%Y-%m-%dT00:00:00%z" | date: "%s" -%}
<h2>Upcoming Meetings</h2>

{%- assign upcoming = false -%}
{%- assign meetings = collections.meetings | sort:"data.meeting_date" -%}
{%- for meeting in meetings -%}
  {%- assign meetingDate = meeting.data.meeting_date | localtime | date:"%s" -%}
  {%- if meetingDate >= today -%}
    <article class="meeting">
        <h1><a href="{{meeting.url }}">{{ meeting.data.title }}</a></h1>
        {%- if meeting.data.hide_date != true -%}<div class="date">{{ meeting.data.meeting_date | localtime | date: "%A, %B %e, %Y" }}</div>{%- endif -%}
        {%- if meeting.data.location -%}<div class="location">{{ meeting.data.location }}</div>{%- endif -%}
        {%-if meeting.data.teaser -%}<div class="teaser">{{ meeting.data.teaser }}</div>{%- endif -%}
        <ul class="meeting-actions">
            {%- if meeting.data.rsvp_link -%}<li><a href="{{ meeting.data.rsvp_link }}"><span class="fa-light fa-reply"></span> RSVP</a></li>{%- endif -%}
            {%-if meeting.data.hide_date != true -%}<li><a href="/meetings/{{ meeting.data.title | slugify }}.ics"><span class="fa-light fa-calendar-circle-plus"></span> Add To Calendar</a></li>{%- endif -%}
        </ul>
    </article>
    {%- assign upcoming = true -%}
  {%- endif -%}
{%- endfor -%}

{%- if upcoming == false -%}
  <p>We have no meetings planned at this time.  Please check back later.</p>
{%- endif -%}

<h2>Past Meetings</h2>

{%- assign currentYear = null -%}
{%- assign revMeetings = collections.meetings | sort:"data.meeting_date" | reverse -%}
{%- for meeting in revMeetings -%}
  {%- assign meetingDate = meeting.data.meeting_date | localtime | date:"%s" -%} 
  {%- assign meetingYear = meeting.data.meeting_date | localtime | date:"%Y" -%}
  {%- if meetingDate < today -%}
    {%- if meetingYear != currentYear -%}
      <h3>{{ meetingYear }}</h3>
      {%- assign currentYear = meetingYear -%}
    {%- endif -%}
    <article class="past-meeting">
        <h1><a href="{{meeting.url }}">{{ meeting.data.title }}</a></h1>
        {%- if meeting.data.hide_date != true -%}<div class="date">{{ meeting.data.meeting_date | localtime | date: "%A, %B %e, %Y" }}</div>{%- endif -%}
        {%-if meeting.data.teaser -%}<div class="teaser">{{ meeting.data.teaser }}</div>{%- endif -%}
    </article>
  {%- endif -%}
{%- endfor -%}
