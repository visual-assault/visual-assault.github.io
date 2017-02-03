---
layout: page
title: visual assault, llc
displayTitle: About
metaDescription: "visual assault - internet creators"
metaOgType: "website"
---

Since 2004 visual assault has been designing and building a wide range
of web sites, apps and tools for open source projects, companies, and startups.
We advise, consult, design, implement, optimize, and maintain.

visual assault is an affinity group of responsible people who take pride
in our output and take our lives seriously. We are not a "work hard/play
hard" organization.

We believe that success is not measured by monetary wealth or position
within a corporate hierarchy; but by the quality of our association
amongst equals, our ability to empower members of our community,
and by our measure of self-actualization.

We believe that the best way to iterate towards success is by taking care
of our families, our partners, each other, and ourselves. We aim for a
sustainable approach to our labor, because that is the best way to
maximize long-term performance, while retaining clarity of vision.

Our mission is to build worthwhile things that might last; and give them
back freely to help empower the open-source community.

## Writing

<ol>
{% for post in site.posts %}
  {% if post.hidden != true %}
    {% unless post.alternate %}
    <li>
      <a href="{{ post.url }}" title="{{ post.title }}">
        <span>{{ post.title }}</span>
      </a>
      <br>
      {% if post.metaDescription %}
      <span>{{ post.metaDescription }}</span>
      {% endif %}
      <br>
      <time datetime="{{ post.date | date: "%Y-%m-%d" }}">{{ post.date | date: "%A %B %-d, %Y" }}</time>
    </li>
    {% endunless %}
  {% endif %}
{% endfor %}
</ol>
