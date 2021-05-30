package backend.util

/**
 * Converts a string to a human readable string.
 */
fun String.toHumanReadable(): String =
    replace(
        Regex(
            String.format(
                "%s|%s|%s",
                "(?<=[A-Z])(?=[A-Z][a-z])",
                "(?<=[^A-Z])(?=[A-Z])",
                "(?<=[A-Za-z])(?=[^A-Za-z])"
            )
        ), " "
    )
