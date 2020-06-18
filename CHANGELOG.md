# 1.3.0 - 2020-07-01

- Adds Google Tag Manager support.

# 1.2.4

- Updates eslint configuration to use `eslint-config-apostrophe`.

# 1.2.3

- Building on 1.2.2, we also should not output the robots meta tag at all if neither box was checked, although there is no harm in an empty one.

# 1.2.2

- Prior to this release there were separate checkboxes for "index, follow", "noindex" and "nofollow", even though checkboxes are nonexclusive, so it was possible to pick "index, follow" and "noindex" simultaneously — an invalid combination. Beginning with this release, there is no "index, follow" option because that is the default behavior of Google and never has to be explicitly chosen. If you want your page to be crawled and indexed normally, just leave the "noindex" and "nofollow" checkboxes alone.

- However, for bc reasons, if you are already using this module you may note that "index, follow" is explicitly output on pages for which you haven't edited the settings yet. That's fine and will have no ill effects. The only case you might want to look into is anywhere you chose an invalid combination of options as described above.

# 1.2.1

- The hard limits placed on seoTitle and seoDescription in version 1.2.0 are now just warnings, but still pop up when appropriate, calling attention to the fact that you are outside Google's guidelines. This is helpful if you are in no rush to shorten your `title` tags.
