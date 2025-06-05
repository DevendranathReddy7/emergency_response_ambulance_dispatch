import { type ChangeEvent } from "react"

type searchProps = {
    searchValue: string
    onSearch: (value: string) => string
}
const SearchFilter: React.FC<searchProps> = ({ searchValue, onSearch }) => {

    const handleFilter = (e: ChangeEvent<HTMLInputElement>) => {
        onSearch(e.target.value)
    }

    return (
        <div className="flex justify-between mb-3 items-center">
            <h1 className="text-lg">Recommended for You!</h1>
            <input className="border-2 border-solid rounded-md h-10 w-60" value={searchValue} id='search-input' type="text" placeholder="search for books" onChange={(e) => handleFilter(e)} />
        </div>
    )
}

export default SearchFilter