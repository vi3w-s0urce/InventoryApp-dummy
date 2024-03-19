import { useDispatch, useSelector } from "react-redux";
import { setCurrentRoute } from "../../Redux/slice";
import Layout from "../../Layouts/Default";
import { Head, Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import Sidebar from "../../Layouts/Sidebar";
import { TbDotsVertical, TbEdit, TbPlus, TbSearch, TbTrash } from "react-icons/tb";
import { Table, Header, HeaderRow, Body, Row, HeaderCell, Cell } from "@table-library/react-table-library/table";
import { HeaderCellSelect, CellSelect, SelectClickTypes, SelectTypes, useRowSelect } from "@table-library/react-table-library/select";
import { useSort, HeaderCellSort, SortToggleType } from "@table-library/react-table-library/sort";
import { useTheme } from "@table-library/react-table-library/theme";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import ModalDelete from "../../Components/modal/ModalDelete";
import { usePagination } from "@table-library/react-table-library/pagination";
import PaginationButton from "../../Components/button/PaginationButton";
import Select from "react-select";
import classNames from "classnames";
import CheckboxInput from "../../Components/input/CheckboxInput";

const ProductCategory = ({ flash, categoriesData }) => {
    const dispatch = useDispatch();

    const darkMode = useSelector((state) => state.darkMode);

    useEffect(() => {
        dispatch(setCurrentRoute({ route: "product", subRoute: "category" }));
    }, []);

    const tableTheme = useTheme({
        Table: `
            ::-webkit-scrollbar {
                width: 10px;
                padding: 100px
            }
          
            ::-webkit-scrollbar-track {
                background-color: #e2e8f0;
                border-radius: 10px;
            }
           
            ::-webkit-scrollbar-thumb {
                background-color: #64748b; 
                border-radius: 10px;
            }
            
            ::-webkit-scrollbar-thumb:hover {
                background-color: #0ea5e9; 
            }

            --data-table-library_grid-template-columns: auto 1fr 1fr 1fr 0.5fr;
        `,
        Row: `
            &:not(:last-of-type) > .td {
                border-bottom: 1px solid #e2e8f0;
            }
            &.row-select-selected {
                background-color: #e2e8f0;
            }
            &.row-select-single-selected {
                background-color: #e0f2fe;
            }
        `,
        BaseCell: `
            &:last-of-type {
                text-align: center;
            },
            &:first-of-type div {
                height: 1.25rem;
            },
            &:first-of-type {
                text-align: center;
            }
        `,
    });

    if (darkMode) {
        tableTheme.Row = `
            &:not(:last-of-type) > .td {
                border-bottom: 1px solid #334155;
            }
        `;
        tableTheme.Table = `
            ::-webkit-scrollbar {
                width: 10px;
                padding: 100px
            }
        
            ::-webkit-scrollbar-track {
                background-color: #334155;
                border-radius: 10px;
            }
        
            ::-webkit-scrollbar-thumb {
                background-color: #94a3b8; 
                border-radius: 10px;
            }
            
            ::-webkit-scrollbar-thumb:hover {
                background-color: #0ea5e9; 
            }

            --data-table-library_grid-template-columns: auto 1fr 1fr 1fr 0.5fr;
        `;
    }

    const [search, setSearch] = useState("");
    const [modalDelete, setModalDelete] = useState(null);
    const [modalDeleteSelected, setModalDeleteSelected] = useState(null);
    const [selectedItem, setSelectedItem] = useState([]);

    const rowsSizeOptions = [
        { value: 5, label: "5" },
        { value: 10, label: "10" },
        { value: 15, label: "15" },
        { value: 20, label: "20" },
        { value: 25, label: "25" },
        { value: 30, label: "30" },
        { value: 35, label: "35" },
        { value: 40, label: "40" },
        { value: 45, label: "45" },
        { value: 50, label: "50" },
    ];

    const [rowsSize, setRowsSize] = useState(rowsSizeOptions[2].value);

    const data = { nodes: categoriesData.filter((item) => item.name.toLowerCase().includes(search.toLowerCase())) };

    const pagination = usePagination(data, {
        state: {
            page: 0,
            size: rowsSize,
        },
    });

    const handleRowsSizeChange = (selected) => {
        setRowsSize(selected.value);
    };

    const handleSearch = (event) => {
        setSearch(event.target.value);
        pagination.fns.onSetPage(0);
    };

    const onSelectChange = (action, state) => {
        setSelectedItem(state.ids);
    };

    const select = useRowSelect(data, {
        onChange: onSelectChange,
    });

    const sort = useSort(
        data,
        {},
        {
            sortToggleType: SortToggleType.AlternateWithReset,
            sortIcon: {
                margin: "8px",
                iconDefault: <FaSort fontSize="small" />,
                iconUp: <FaSortUp fontSize="small" />,
                iconDown: <FaSortDown fontSize="small" />,
            },
            sortFns: {
                CATEGORYNAME: (array) => array.sort((a, b) => a.name.localeCompare(b.name)),
            },
        }
    );

    return (
        <Layout flash={flash}>
            <Head>
                <title>Product Category | ARGEInventory</title>
            </Head>
            <Sidebar />
            <AnimatePresence>
                {modalDelete ? (
                    <ModalDelete
                        itemID={modalDelete}
                        closeModal={(id = null) => setModalDelete(id)}
                        type="category"
                        description="Are you sure to delete this category?"
                    />
                ) : modalDeleteSelected && (
                    <ModalDelete
                        itemID={modalDeleteSelected}
                        closeModal={(id = null) => setModalDeleteSelected(id)}
                        type="category_selected"
                        description="Are you sure to delete all selected item category?"
                    />
                )}
            </AnimatePresence>
            <section className="ml-80 p-8 relative">
                <div className="mb-5">
                    <h1 className="text-3xl font-bold">Product Category</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-lg">List of Product Categories</p>
                </div>
                <div className="bg-white dark:bg-slate-800 shadow-lg p-5 rounded-xl">
                    <div className="flex justify-between items-center">
                        <p className="text-xl font-bold">
                            Categories{" "}
                            <span className="bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400 p-2 rounded-lg text-lg ml-1">
                                {categoriesData.length}
                            </span>
                        </p>
                        <div className="flex items-center gap-3">
                            <AnimatePresence>
                                {selectedItem.length > 0 && (
                                    <motion.button className="flex items-center gap-2 bg-red-400 dark:bg-red-500 text-white dark:text-slate-800 hover:bg-red-500 dark:hover:bg-red-400 px-3 py-2 rounded-lg font-bold whitespace-nowrap transition-all"
                                    onClick={ () => setModalDeleteSelected(selectedItem) }
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1}}
                                    exit={{ opacity: 0}} >
                                        <TbTrash className="font-bold text-xl" /> Delete Selected
                                    </motion.button>
                                )}
                            </AnimatePresence>
                            <label
                                htmlFor="search_category"
                                className={`flex items-center border-2 dark:border-slate-700 rounded-lg px-2 ${
                                    search && data.nodes.length == 0
                                        ? "!border-red-200 dark:!border-red-500 dark:!border-opacity-20"
                                        : search && "border-sky-300 dark:!border-sky-500 dark:!border-opacity-20"
                                } transition-all`}
                            >
                                <TbSearch
                                    className={`text-2xl mr-2 text-slate-400 ${
                                        search && data.nodes.length == 0 ? "!text-red-500" : search && "!text-sky-500"
                                    } transition-all`}
                                />
                                <input
                                    name="search"
                                    id="search_category"
                                    className="w-full py-2 outline-none rounded-lg dark:bg-slate-800 transition-all"
                                    placeholder="Search by Category Name"
                                    onChange={handleSearch}
                                />
                            </label>
                            <Link
                                href={route("category.create")}
                                className="flex items-center gap-2 bg-emerald-400 dark:bg-emerald-500 text-white dark:text-slate-800 hover:bg-emerald-500 dark:hover:bg-emerald-400 px-3 py-2 rounded-lg font-bold whitespace-nowrap transition-all"
                            >
                                <TbPlus className="font-bold text-xl" /> Add Category
                            </Link>
                        </div>
                    </div>
                    <div className="max-h-[38rem] relative">
                        <Table
                            data={data}
                            className="text-lg mt-3 !table-fixed max-h-[38rem] !border-b-2 dark:border-slate-600"
                            theme={tableTheme}
                            sort={sort}
                            layout={{ fixedHeader: true, custom: true }}
                            pagination={pagination}
                            select={select}
                        >
                            {(tableList) => (
                                <>
                                    <Header>
                                        <HeaderRow
                                            className="!bg-slate-100 dark:!bg-slate-700 text-slate-500 dark:text-slate-400"
                                            layout={{ custom: true }}
                                        >
                                            <HeaderCell className="border-s-2 border-y-2 rounded-s-xl !py-2 !px-3 dark:border-slate-600">
                                                <CheckboxInput
                                                    name="tableSelect"
                                                    checked={select.state.all}
                                                    indeterminate={!select.state.all && !select.state.none}
                                                    onChange={select.fns.onToggleAll}
                                                />
                                            </HeaderCell>
                                            <HeaderCellSort
                                                className="!py-2 !px-3 border-y-2 border-slate-200 dark:border-slate-600 hover:text-sky-500 transition-all"
                                                sortKey="CATEGORYNAME"
                                            >
                                                Category Name
                                            </HeaderCellSort>
                                            <HeaderCell className="!py-2 !px-3 border-y-2 dark:border-slate-600">Description</HeaderCell>
                                            <HeaderCell className="!py-2 !px-3 border-y-2 dark:border-slate-600">Total Products</HeaderCell>
                                            <HeaderCell className="!py-2 !px-3 rounded-r-xl border-y-2 border-r-2 border-slate-200 dark:border-slate-600">
                                                Action
                                            </HeaderCell>
                                        </HeaderRow>
                                    </Header>
                                    <Body>
                                        {tableList.map((item) => (
                                            <Row
                                                key={item.id}
                                                item={item}
                                                className="dark:!bg-slate-800 hover:bg-slate-100 dark:hover:!bg-slate-700 cursor-pointer transition-all"
                                            >
                                                <Cell className="!p-3 rounded-s-xl">
                                                    <CheckboxInput
                                                        name={"tableItemSelect" + item.id}
                                                        checked={select.state.ids.includes(item.id)}
                                                        onChange={() => select.fns.onToggleById(item.id)}
                                                    />
                                                </Cell>
                                                <Cell className="!p-3">
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        whileInView={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.05 }}
                                                        className={`w-fit px-3 font-bold rounded-lg ${
                                                            item.color == "Red"
                                                                ? "!bg-red-200 text-red-500 dark:!bg-opacity-20 dark:!bg-red-500"
                                                                : item.color == "Green"
                                                                ? "!bg-green-200 text-green-500 dark:!bg-opacity-20 dark:!bg-green-500"
                                                                : item.color == "Blue"
                                                                ? "!bg-blue-200 text-blue-500 dark:!bg-opacity-20 dark:!bg-blue-500"
                                                                : item.color == "Yellow"
                                                                ? "!bg-yellow-200 text-yellow-500 dark:!bg-opacity-20 dark:!bg-yellow-500"
                                                                : item.color == "Purple"
                                                                ? "!bg-purple-200 text-purple-500 dark:!bg-opacity-20 dark:!bg-purple-500"
                                                                : item.color == "Cyan"
                                                                ? "!bg-cyan-200 text-cyan-500 dark:!bg-opacity-20 dark:!bg-cyan-500"
                                                                : null
                                                        }`}
                                                    >
                                                        {item.name}
                                                    </motion.div>
                                                </Cell>
                                                <Cell className="!p-3">
                                                    <motion.div
                                                        className="whitespace-normal"
                                                        initial={{ opacity: 0, y: 10 }}
                                                        whileInView={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.05 }}
                                                    >
                                                        {item.description}
                                                    </motion.div>
                                                </Cell>
                                                <Cell className="!p-3">
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        whileInView={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.05 }}
                                                    >
                                                        0
                                                    </motion.div>
                                                </Cell>
                                                <Cell className="!p-3 rounded-r-xl">
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        whileInView={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.05 }}
                                                        className="flex gap-3 justify-center"
                                                    >
                                                        <TbEdit className="text-3xl text-slate-500 dark:text-slate-400 hover:text-sky-500 transition-all" />
                                                        <TbTrash
                                                            className="text-3xl text-slate-500 dark:text-slate-400 hover:text-red-500 transition-all"
                                                            onClick={() => setModalDelete(item.id)}
                                                        />
                                                    </motion.div>
                                                </Cell>
                                            </Row>
                                        ))}
                                    </Body>
                                </>
                            )}
                        </Table>
                    </div>
                    <div className="w-full mt-5 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <span className="text-slate-500 dark:text-slate-400">Rows per page</span>
                            <Select
                                menuPlacement="top"
                                options={rowsSizeOptions}
                                defaultValue={rowsSizeOptions.find((options) => options.value === rowsSize)}
                                onChange={handleRowsSizeChange}
                                isSearchable={false}
                                classNames={{
                                    control: ({ isFocused }) =>
                                        classNames(
                                            "!border-2 !outline-none !rounded-xl dark:!bg-slate-800",
                                            isFocused
                                                ? "!border-sky-200 dark:!border-sky-500 dark:!border-opacity-20"
                                                : "!border-slate-200 dark:!border-slate-600"
                                        ),
                                    singleValue: () => classNames("!text-slate-500 dark:!text-slate-400"),
                                    dropdownIndicator: () => classNames("dark:!text-slate-400"),
                                    indicatorSeparator: () => classNames("hidden"),
                                    menu: () => classNames("!rounded-xl dark:!bg-slate-800"),
                                    option: ({ isSelected, isFocused }) => classNames(isSelected && "!bg-sky-400", isFocused && "dark:!bg-slate-600"),
                                }}
                                classNamePrefix="react-select"
                            />
                        </div>
                        <PaginationButton pagination={pagination} data={data} />
                        <div className="text-slate-500 dark:text-slate-400 flex items-center justify-end gap-1 w-52">
                            Total page
                            <span className="bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400 font-bold p-2 text-sm rounded-lg ml-1">
                                {pagination.state.getTotalPages(data.nodes)}
                            </span>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default ProductCategory;
