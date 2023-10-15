module.exports = function () {
    return {
        tags: "meetings",
        layout: "meeting",
        permalink: "/meetings/{{ title | slugify }}/",
        eleventyNavigation: {
            parent: "meetings",
            key: "{{ title }}"
        }
    }
}
