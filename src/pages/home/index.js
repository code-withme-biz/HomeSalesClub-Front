import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableContainer from "@material-ui/core/TableContainer";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import ClearIcon from "@material-ui/icons/Clear";
import LastPageIcon from "@material-ui/icons/LastPage";
import {
  fetchOwnerProductProperties,
  updateFilerData,
} from "../../reducers/ownerProductProperties";
import { Input, Button } from "reactstrap";
import Tag from "../../components/tag";
import ReactLoading from "react-loading";
import ReactMultiSelectCheckboxes from "react-multiselect-checkboxes";

const columnInfos = [
  ["Created At", "Created At"],
  ["Updated At", "Updated At"],
  ["Practice Type", "PracticeType"],
  ["Property Address", "Property Addresses"],
  ["Property Unit #", "Property Unit #"],
  ["Property City", "Property City"],
  ["Property State", "Property State"],
  ["Property Zip", "Property Zip"],
  ["County", "County"],
  ["List Stacker", "List Stacker"],
  ["Owner Occupied", "Owner Occupied"],
  ["First Name", "First Name"],
  ["Last Name", "Last Name"],
  ["Middle Name", "Middle Name"],
  ["Name Suffix", "Name Suffix"],
  ["Full Name", "Full Name"],
  ["Mailing Care of Name", "Mailing Care of Name"],
  ["Mailing Address", "Mailing Address"],
  ["Mailing Unit #", "Mailing Unit #"],
  ["Mailing City", "Mailing City"],
  ["Mailing State", "Mailing State"],
  ["Mailing Zip", "Mailing Zip"],
  ["Property Type", "Property Type"],
  ["Total Assessed Value", "Total Assessed Value"],
  ["Last Sale Recording Date", "Last Sale Recording Date"],
  ["Last Sale Amount", "Last Sale Amount"],
  ["Est Value", "Est Value"],
  ["Est Equity", "Est Equity"],
  ["Year Built", "Year Built"],
  ["Effective Year Built", "Effective Year Built"],
  ["sqft", "Square Foot"],
  ["sqftlot", "Lot Size"],
  ["bedrooms", "Bedrooms"],
  ["bathrooms", "Bathrooms"],
  ["vacancy", "Vacancy"],
  ["vacancyDate", "Vacancy Date"],
  ["parcel", "Parcel"],
  ["descbldg", "Descbldg"],
  ["listedPrice", "Listed Price"],
  ["listedPriceType", "Listed Price Type"],
  ["listedPrice1", "Listed Price 1"],
  ["listedPriceType1", "Listed Price Type 1"],
  ["sold", "Is Sold"],
  ["Sold Date", "Sold Date"],
  ["soldAmount", "Sold Amount"],
  ["Toal Open Loans", "Toal Open Loans"],
  ["Lien Amount", "Lien Amount"],
  [
    "Est. Remaining balance of Open Loans",
    "Est. Remaining balance of Open Loans",
  ],
  ["Tax Lien Year", "Tax Lien Year"],
  ["propertyAppraiserProcessed", "Property Appraiser Processed"],
  ["vacancyProcessed", "VacancyProcessed"],
];

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props.data;
  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0 || props.isFetching}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0 || props.isFetching}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={
          page >= Math.ceil(count / rowsPerPage) - 1 || props.isFetching
        }
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={
          page >= Math.ceil(count / rowsPerPage) - 1 || props.isFetching
        }
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

const Home = ({
  data,
  fetchOwnerProductProperties,
  practiceType,
  startDate,
  endDate,
  token,
  filterData,
  isFetching,
  count = 0,
  updateFilerData,
  selState,
  selCounty,
}) => {
  const [options, setOptions] = React.useState(
    columnInfos.map((ci, index) => ({
      label: ci[1],
      value: ci[0],
      index,
    }))
  );

  const [page, setPage] = React.useState(0);
  const [selColumn, setSelColumn] = React.useState("");
  const [keyword, setKeyword] = React.useState("");
  const [selectedColumns, setSelectedColumns] = React.useState(options);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [clickRows, setClickRows] = React.useState([""]);
  const [clicked, setClicked] = React.useState("");
  const [clickedRow, setRow] = React.useState({});

  const handleChangePage = (event, newPage) => {
    fetchOwnerProductProperties({
      currentPage: newPage,
      from: startDate,
      to: endDate,
      token,
      perPage: rowsPerPage,
      practiceType,
      filters: JSON.stringify(filterData),
      count,
      state: selState,
      county: selCounty,
    });
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    const perPage = parseInt(event.target.value, 10);
    fetchOwnerProductProperties({
      currentPage: page,
      from: startDate,
      to: endDate,
      token,
      perPage,
      practiceType,
      filters: JSON.stringify(filterData),
      count,
      state: selState,
      county: selCounty,
    });
    setRowsPerPage(perPage);
    setPage(0);
  };

  const handleClickRow = (event, key, row) => {
    setRow(row);
    if (clicked) {
      setClicked("");
    } else {
      setClicked(key);
    }
    if (clickRows.includes(key)) {
      setClickRows(clickRows.filter((row) => row !== key));
    } else {
      setClickRows([...clickRows, key]);
    }
  };

  const handleCloseDetail = (clicked) => {
    setClicked("");
    setClickRows(clickRows.filter((row) => row !== clicked));
  };

  const onChangeColumn = (e) => {
    setKeyword("");
    setSelColumn(e.target.value);
  };
  const onChangeKeyword = (e) => {
    setKeyword(e.target.value);
  };
  const onAddFilter = () => {
    let newTags = [];
    if (selColumn === "-") return;
    if (keyword.trim() === "") return;
    newTags.push(...filterData, [selColumn, keyword]);
    fetchOwnerProductProperties({
      currentPage: page,
      from: startDate,
      to: endDate,
      token,
      perPage: rowsPerPage,
      practiceType,
      filters: JSON.stringify(newTags),
      count: -1,
      state: selState,
      county: selCounty,
    });
    updateFilerData(newTags);
    setSelColumn("");
    setKeyword("");
  };
  const onChangeColumns = (e) => {};
  const onRemoveTag = (label) => {
    const key = label.split(":")[0];
    let newTags = filterData;
    newTags = newTags.filter((newTags) => newTags[0] !== key.trim());
    fetchOwnerProductProperties({
      currentPage: page,
      from: startDate,
      to: endDate,
      token,
      perPage: rowsPerPage,
      practiceType,
      filters: JSON.stringify(newTags),
      count: -1,
      state: selState,
      county: selCounty,
    });
    updateFilerData(newTags);
  };
  return (
    <div className="home">
      {isFetching && (
        <ReactLoading
          className="loading"
          type="bubbles"
          color="#527be7"
          height={667}
          width={375}
        />
      )}
      {clicked ? (
        <React.Fragment>
          <Container maxWidth="sm">
            <Typography
              component="div"
              style={{
                backgroundColor: /LLC/g.test(clickedRow["Full Name"])
                  ? "#cfe8fc"
                  : "#8fccfe",
                height: "80vh",
              }}
            >
              <ClearIcon
                onClick={() => {
                  handleCloseDetail(clicked);
                }}
                style={{ cursor: "pointer" }}
              />
              <div style={{ margin: 30 }}>
                <div>Full Name : {clickedRow["Full Name"]}</div>
                <br />
                <div>Mailing Address : {clickedRow["Mailing Address"]}</div>
                <br />
                <div>Properties : </div>
                {clickedRow["properties"].map((ele) => (
                  <React.Fragment>
                    <div>{`${ele["property_address"]}, ${ele["practiceType"]}`}</div>
                  </React.Fragment>
                ))}
              </div>
            </Typography>
          </Container>
        </React.Fragment>
      ) : (
        <TableContainer component={Paper}>
          <Table className="custom pagination table">
            <TableHead>
              <TableRow>
                {columnInfos.map((column) => (
                  <Fragment>
                    <TableCell key={column[1]}>{column[1]}</TableCell>
                  </Fragment>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => {
                return (
                  <TableRow
                    key={row["Property Id"]}
                    onClick={(event) =>
                      handleClickRow(event, row["Property Id"], row)
                    }
                  >
                    {columnInfos.map((item) => {
                      if (!clickRows.includes(row["Property Id"])) {
                        return (
                          <TableCell style={{ width: 80 }} align="right">
                            {row[item[0]]}
                          </TableCell>
                        );
                      } else {
                        if (item[0] == "Property Address") {
                          return (
                            <TableCell style={{ width: 80 }} align="right">
                              {row["properties"].map((ele) => (
                                <div>{`${ele["property_address"]}, ${ele["practiceType"]}`}</div>
                              ))}
                            </TableCell>
                          );
                        } else {
                          return (
                            <TableCell style={{ width: 80 }} align="right">
                              {row[item[0]]}
                            </TableCell>
                          );
                        }
                      }
                    })}
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell colSpan={6} />
              </TableRow>
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[10, 20, 50, 100]}
                  colSpan={8}
                  count={count}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: { "aria-label": "rows per page" },
                    native: true,
                  }}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                  ActionsComponent={(props) => (
                    <TablePaginationActions
                      isFetching={isFetching}
                      data={props}
                    />
                  )}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

const mapStateToPros = (state) => {
  console.log(state);
  return {
    count: state.ownerProductProperties.count,
    isFetching: state.ownerProductProperties.isFetching,
    data: state.ownerProductProperties.data,
    startDate: state.ownerProductProperties.startDate,
    endDate: state.ownerProductProperties.endDate,
    practiceType: state.ownerProductProperties.practiceType,
    token: state.auth.token,
    filterData: state.ownerProductProperties.filterData,
  };
};

const mapDispatchToPros = (dispatch) => {
  return {
    fetchOwnerProductProperties: (data) => {
      dispatch(fetchOwnerProductProperties(data));
    },
    updateFilerData: (data) => {
      dispatch(updateFilerData(data));
    },
  };
};

export default connect(mapStateToPros, mapDispatchToPros)(Home);
