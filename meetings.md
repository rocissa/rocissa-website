---
title: Meetings
layout: page
section: meeting
eleventyNavigation:
  key: meetings
  title: Meetings
  class: meetings
---
{%- assign today = "now" | date: "%Y-%m-%dT00:00:00%z" | date: "%s" -%}
<h2>Upcoming Meetings</h2>

{%- assign upcoming = false -%}
{%- for meeting in collections.meetings | sort:"meeting_date" -%}
  {%- assign meetingDate = meeting.data.meeting_date | localtime | date:"%s" -%}
  {%- if meetingDate >= today -%}
    <article class="meeting">
        <h1><a href="{{meeting.url }}">{{ meeting.data.title }}</a></h1>
        {%- if meeting.data.hide_date != true -%}<div class="date">{{ meeting.data.meeting_date | localtime | date: "%A, %B %d, %Y" }}</div>{%- endif -%}
        {%- if meeting.data.location -%}<div class="location">{{ meeting.data.location }}</div>{%- endif -%}
        {%-if meeting.data.teaser -%}<div class="teaser">{{ meeting.data.teaser }}</div>{%- endif -%}
    </article>
    {%- assign upcoming = true -%}
  {%- endif -%}
{%- endfor -%}

{%- if upcoming == false -%}
  <p>We have no meetings planned at this time.  Please check back later.</p>
{%- endif -%}

<h2>Past Meetings</h2>

{%- assign currentYear = null -%}
{%- assign revMeetings = collections.meetings | sort:"meeting_date" | reverse -%}
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
        {%- if meeting.data.hide_date != true -%}<div class="date">{{ meeting.data.meeting_date | localtime | date: "%A, %B %d, %Y" }}</div>{%- endif -%}
        {%-if meeting.data.teaser -%}<div class="teaser">{{ meeting.data.teaser }}</div>{%- endif -%}
    </article>
  {%- endif -%}
{%- endfor -%}
