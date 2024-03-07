import { useDispatch, useSelector } from "react-redux";
import { setCurrentRoute } from "../../Redux/slice";
import Layout from "../../Layouts/Default";
import { Head, Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import Sidebar from "../../Layouts/Sidebar";
import { TbDotsVertical, TbEdit, TbPlus, TbSearch, TbTrash } from "react-icons/tb";
import { Table, Header, HeaderRow, Body, Row, HeaderCell, Cell } from "@table-library/react-table-library/table";
import { useSort, HeaderCellSort, SortToggleType } from "@table-library/react-table-library/sort";
import { useTheme } from "@table-library/react-table-library/theme";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import TextInput from "../../Components/input/TextInput";
import ActionButtonTable from "../../Components/button/ActionButtonTable";
import ModalDelete from "../../Components/modal/ModalDelete";
import { usePagination } from "@table-library/react-table-library/pagination";
import { current } from "@reduxjs/toolkit";
import PaginationButton from "../../Components/button/PaginationButton";

const ProductCategory = ({ flash, categoriesData }) => {
    const dispatch = useDispatch();

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

            width: 100%;
            position: static;

            --data-table-library_grid-template-columns: 1fr 1fr 1fr 0.5fr;


        `,
        Row: `
            &:not(:last-of-type) > .td {
                border-bottom: 1px solid #e2e8f0;
            }
        `,
        BaseCell: `
            &:last-of-type {
                text-align: center;
            }
        `,
    });

    const [search, setSearch] = useState("");
    const [modalDelete, setModalDelete] = useState(null);

    const data = { nodes: categoriesData.filter((item) => item.name.toLowerCase().includes(search.toLowerCase())) };

    const pagination = usePagination(data, {
        state: {
            page: 0,
            size: 15,
        },
    });

    const handleSearch = (event) => {
        setSearch(event.target.value);
        pagination.fns.onSetPage(0);
    };


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
                {modalDelete && (
                    <ModalDelete
                        itemID={modalDelete}
                        closeModal={(id = null) => setModalDelete(id)}
                        type="category"
                        description="Are you sure to delete this category?"
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
                            Categories <span className="bg-slate-200 text-slate-500 p-2 rounded-lg text-lg ml-1">{categoriesData.length}</span>
                        </p>
                        <div className="flex items-center gap-3">
                            <div
                                className={`flex items-center border-2 rounded-lg px-2 ${
                                    search && data.nodes.length == 0 ? "!border-red-200" : search ? "border-sky-300" : null
                                } transition-all`}
                            >
                                <TbSearch
                                    className={`text-2xl mr-2 text-slate-400 ${
                                        search && data.nodes.length == 0 ? "!text-red-500" : search ? "!text-sky-500" : null
                                    } transition-all`}
                                />
                                <input
                                    name="search"
                                    className="w-full py-2 outline-none rounded-lg transition-all"
                                    placeholder="Search by Category Name"
                                    onChange={handleSearch}
                                />
                            </div>
                            <Link
                                href={route("category.create")}
                                className="flex items-center gap-2 bg-emerald-400 text-white px-3 py-2 rounded-lg font-bold whitespace-nowrap"
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
                        >
                            {(tableList) => (
                                <>
                                    <Header>
                                        <HeaderRow className="!bg-slate-100 dark:!bg-slate-700 text-slate-500 dark:text-slate-400" layout={{ custom: true }}>
                                            <HeaderCellSort
                                                className="!py-2 !px-3 rounded-s-xl border-y-2 border-s-2 border-slate-200 dark:border-slate-600 hover:text-sky-500 transition-all"
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
                                            <Row key={item.id} item={item} className="dark:!bg-slate-800 hover:bg-slate-100 cursor-pointer transition-all">
                                                <Cell className="!p-3 rounded-s-xl">
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        whileInView={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.05 }}
                                                        className={`w-fit px-3 font-bold rounded-lg ${
                                                            item.color == "Red"
                                                                ? "!bg-red-200 text-red-500"
                                                                : item.color == "Green"
                                                                ? "!bg-green-200 text-green-500"
                                                                : item.color == "Blue"
                                                                ? "!bg-blue-200 text-blue-500"
                                                                : item.color == "Yellow"
                                                                ? "!bg-yellow-200 text-yellow-500"
                                                                : item.color == "Purple"
                                                                ? "!bg-purple-200 text-purple-500"
                                                                : item.color == "Cyan"
                                                                ? "!bg-cyan-200 text-cyan-500"
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
                                                        <TbEdit className="text-3xl text-slate-500 hover:text-sky-500 transition-all" />
                                                        <TbTrash
                                                            className="text-3xl text-slate-500 hover:text-red-500 transition-all"
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
                        <div className="text-slate-400 w-52">Showing 15 item per page</div>
                        <PaginationButton pagination={pagination} data={data} />
                        <div className="text-slate-400 flex items-center justify-end gap-1 w-52">
                            Total page
                            <span className="bg-slate-200 text-slate-500 font-bold p-2 text-sm rounded-lg ml-1">
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
