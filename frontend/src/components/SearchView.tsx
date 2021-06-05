import { Input, InputGroup, InputLeftElement } from '@chakra-ui/input'
import React, { useEffect, useState } from 'react'
import { MdSearch } from "react-icons/md";

export default function SearchView(props: any) {
    const [search, setSearch] = useState("")
    const [timer, setTimer] = useState(0)

    useEffect(() => {
        clearTimeout(timer)
        setTimer(setTimeout(async () => {
            props.onTextChange?.(search);
        }, 100))
    }, [search])

    const onTextChange = (e: any) => {
        setSearch(e.target.value);
    }
    return (
        <InputGroup>
            <InputLeftElement
                pointerEvents="none"
                children={<MdSearch color="blue" />}
            />
            <Input type="text" placeholder="Search" onChange={onTextChange}/>
        </InputGroup>
    )
}
