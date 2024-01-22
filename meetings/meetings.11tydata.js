module.exports = function () {
    return {
        tags: "meetings",
        layout: "meeting",
        date: "git Last Modified",
        permalink: "/meetings/{{ title | slugify }}/",
        eleventyNavigation: {
            parent: "meetings",
            key: "{{ title }}"
        }
    }
}
