import React from 'react'

import { Box, Link, Button, Text } from "@chakra-ui/react"

function Card(props: any) {
    const title = props.title;
    const description = props.description;
    const actionTitle = props.actionTitle;
    const actionLink = props.actionLink;

    return (
        <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
            <Box p="6">
                <Box d="flex" alignItems="baseline">
                    <Text fontSize="25" ><b>{title}</b></Text>
                </Box>

                <Box mt="1" fontWeight="normal" as="h4" lineHeight="tight">
                    <Text align="start">
                        {description}
                    </Text>
                </Box>
                <br></br>
                {
                    actionTitle && actionLink
                        ? <Box textAlign="end" >
                            <Link href={actionLink} isExternal>
                                <Button> {actionTitle}</Button>
                            </Link>
                        </Box>
                        : <></>
                }

            </Box>
        </Box>
    )
}

export default Card;