import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import SearchField from './SearchField';
import Select from './Select';
import Table, { Column } from './Table';
import ToolTip from './Tooltip';

type PaginatedTableProps<T> = {
	fetchData: (searchString: string, pageNumber: number, pageSize: number) => Promise<PageData<T>>;
	columns: Column[];
};
export type PageData<T> = {
	data: T[],
	result_length: number
};

function PaginatedTable<T>(props: PaginatedTableProps<T>) {
	const [settings, setSettings] = useState({
		pageSize: 10,
		pageNumber: 1,
		searchString: "",
		result_length: 0,
	});
	const [data, setData] = useState<T[]>([]);
	const [search, setSearch] = useState("");

	useEffect(() => {
		props.fetchData(settings.searchString, settings.pageNumber, settings.pageSize).then(result => {
			/* Fetch the first page when this component first renders */
			setData(result.data);
			setSettings({ ...settings, result_length: result.result_length });
		});
	}, [settings.pageSize, settings.pageNumber, settings.searchString]);

	const onChange = (event: React.ChangeEvent) => {
		const { name, value } = event.target as any;
		if (name === "pageSize") {
			let pageSize = parseInt(value);
			setSettings({ ...settings, [name]: pageSize, pageNumber: 1 });
			return;
		}
		if (name === "search") {
			setSearch(value);
		}
	}
	const onArrowClickForward = () => {
		const maxPages = Math.ceil(settings.result_length / settings.pageSize);
		if (settings.pageNumber + 1 > maxPages) {
			Swal.fire({ icon: "warning", text: "Sorry, no more pages." });
			return;
		}
		setSettings({ ...settings, "pageNumber": settings.pageNumber + 1 });
	}
	const onLastPageClicked = () => {
		const lastPageNumber = Math.ceil(settings.result_length / settings.pageSize );
		setSettings({...settings, pageNumber: lastPageNumber});
	}
	const onArrowClickBack = () => {
		let pageNumber = settings.pageNumber;
		if (pageNumber === 1) {
			Swal.fire({ icon: "warning", text: "Sorry you cannot go below page 1." });
			return;
		}
		setSettings({ ...settings, pageNumber: settings.pageNumber - 1 });
	}
	const onFirstPageClicked = () => {
		setSettings({...settings, pageNumber: 1});
	}
	const onEnterPressed = (event: React.KeyboardEvent) => {
		const { name, value } = event.target as any;
		if (event.key === 'Enter') {
			setSettings({ ...settings, searchString: value });
		}
	}
	const firstRow = (settings.pageNumber - 1) * settings.pageSize;
	const lastRow = ((firstRow + settings.pageSize) < settings.result_length) ? firstRow + settings.pageSize : settings.result_length;
	return (
		<div className="flex flex-col bg-gray-200 rounded-xl">
			<div className="flex flex-row items-center h-24 p-5">
				<div className="flex flex-row items-center justify-center">
					<SearchField value={search} onChange={onChange} name="search" onKeyDown={onEnterPressed} />
					<div className="mx-3">
						<ToolTip popupColor={"gray-100"} popupText="Press enter to search" iconColor="gray-400" textColor="gray-700" />
					</div>
				</div>
				<div className="ml-auto flex flex-row items-center">

					<Select name="pageSize" onChange={onChange} label="Rows per page" className="w-44" default={10}>
						<option value="25">25</option>
						<option value="50">50</option>
					</Select>

					<p className="text-gray-500 mx-10">{`${firstRow + 1}-${lastRow} of ${settings.result_length}`}</p>

					<div className="mx-5">
						<i onClick={onFirstPageClicked} className="material-icons select-none text-gray-500 hover:text-indigo-700 cursor-pointer">first_page</i>
						<i onClick={onArrowClickBack} className="material-icons select-none text-gray-500 mx-5 hover:text-indigo-700 cursor-pointer">chevron_left</i>
						<i onClick={onArrowClickForward} className="material-icons select-none text-gray-500 hover:text-indigo-700 cursor-pointer">navigate_next</i>
						<i onClick={onLastPageClicked} className="material-icons select-none text-gray-500 mx-5 hover:text-indigo-700 cursor-pointer">last_page</i>
					</div>

				</div>
			</div>
			<Table columns={props.columns} data={data} />
		</div>
	);
}

export default PaginatedTable;
