import React, { Component } from "react";
import { Button, Input } from "reactstrap";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { Multiselect } from 'multiselect-react-dropdown';
import { connect } from "react-redux";
import {
  fetchOwnerProductProperties,
  updateDateRange,
  updatePracticeType,
  updateState,
  updateCounty,
  updateZip,
  updateOwners,
} from "../../reducers/ownerProductProperties";
import { deleteToken } from "../../reducers/auth";
import moment from "moment";
import { Link } from "react-router-dom";
import counties from "./counties.json";
import ImportModal from "./import-modal";

import axios from "axios";
const lastExportString = "Last Export";
class Logo extends Component {
  render() {
    return (
      <Link to="/dashboard">
        <img className="logo" src="/logo.png" alt="logo" />
      </Link>
    );
  }
}
class Header extends Component {
  constructor() {
    super();
    this.state = {
      exporting: false,
      fromLastExport: false,
      modalOpen: false,
      options: [
        { value: "all", label: "all" },
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4", label: "4" },
        { value: "5", label: "5" },
        { value: "6", label: "6" },
        { value: "7", label: "7" },
        { value: "8", label: "8" },
        { value: "9", label: "9" },
        { value: "10", label: "10" },
      ],
      value: "",

      multiSelectOptions: [
        'foreclosure',
        'preforeclosure',
        'bankruptcy',
        'tax-lien',
        'auction',
        'inheritance',
        'probate',
        'eviction',
        'hoa-lien',
        'irs-lien',
        'enforce-lien',
        'mortgage-lien',
        'pre-inheritance',
        'pre-probate',
        'divorce',
        'tax-delinquency',
        'code-violation',
        'absentee-property-owner',
        'vacancy',
        'debt',
        'personal-injury',
        'marriage',
        'child-support',
        'criminal',
        'insurance-claims',
        'employment-discrimination',
        'traffic',
        'property-defect',
        'declaratory-judgment',
        'other-civil'
      ],
    };
  }

  onDateRangeCallback = (start, end, label) => {
    const { token, filterData, practiceType, selState, selCounty, zip, owners } =
      this.props;
    const startDate = start.format("MM/DD/yyyy");
    const endDate = end.format("MM/DD/yyyy");
    const lastExport = label === lastExportString;
    this.setState({ ...this.state, fromLastExport: lastExport });
    this.props.updateDateRange({ startDate, endDate });
    this.props.fetchOwnerProductProperties({
      token,
      from: startDate,
      to: endDate,
      currentPage: 1,
      perPage: 20,
      practiceType,
      filters: JSON.stringify(filterData),
      count: -1,
      state: selState,
      county: selCounty,
      zip,
      owners,
    });
    // if(!lastExport){
    // }
  };

  onFetchData = () => {
    const {
      token,
      startDate,
      endDate,
      isFetching,
      practiceType,
      filterData,
      selState,
      selCounty,
      zip,
      owners
    } = this.props;
    if (isFetching) return;
    this.props.fetchOwnerProductProperties({
      token,
      from: startDate,
      to: endDate,
      currentPage: 1,
      perPage: 20,
      practiceType,
      filters: JSON.stringify(filterData),
      count: -1,
      state: selState,
      county: selCounty,
      zip,
      owners,
    });
  };

  onExport = async () => {
    const { exporting } = this.state;
    if (exporting) return;
    const {
      token,
      startDate,
      endDate,
      isFetching,
      filterData,
      practiceType,
      selState,
      selCounty,
      zip,
      owners
    } = this.props;
    console.log(owners);
    const endpoint =
      process.env.REACT_APP_NODE_ENV === "development"
        ? process.env.REACT_APP_EXPORT_API_DEV
        : process.env.REACT_APP_EXPORT_API_PROD;
    let url = `${endpoint}?token=${token}&from=${startDate}&to=${endDate}&practiceType=${practiceType}&filters=${JSON.stringify(
      filterData
    )}&state=${selState}&county=${selCounty}`;
    if (zip) {
      url += `&zip=${zip}`;
    }
    if (owners) {
      url += `&owners=${owners}`;
    }
    // const encoded = encodeURI(url);
    // console.log(encoded)
    // window.open(url, "_blank");
    this.setState({ exporting: true });

    try {
      let response = await axios({
        url: url,
        method: "GET",
        responseType: "blob", // important
        timeout: 900000,
      });
      alert("export finished");
      const download_link = window.URL.createObjectURL(
        new Blob([response.data])
      );
      const link = document.createElement("a");
      link.href = download_link;
      link.setAttribute("download", "export.zip");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      alert("Error during exporting...");
      console.log(error);
    }
    this.setState({ ...this.state, exporting: false });
  };

  onSelect = (event) => {
    this.setState({ ...this.state, value: event.value });
    const {
      token,
      startDate,
      endDate,
      isFetching,
      practiceType,
      filterData,
      selState,
      selCounty,
      zip,
    } = this.props;
    this.props.updateOwners({ owners: event.value });
    this.props.fetchOwnerProductProperties({
      token,
      from: startDate,
      to: endDate,
      currentPage: 1,
      perPage: 20,
      practiceType,
      filters: JSON.stringify(filterData),
      count: -1,
      state: selState,
      county: selCounty,
      zip,
      owners: event.value,
    });
  };

  onLogout = () => {
    this.props.deleteToken();
    window.location.href = "/";
  };

  onChangePracticeType = (e) => {
    const {
      token,
      startDate,
      endDate,
      isFetching,
      practiceType,
      filterData,
      selState,
      selCounty,
      zip,
      owners
    } = this.props;
    console.log(e);
    // console.log(this.state.multiSelectOptions);
    this.props.updatePracticeType({ practiceType: e.length > 0 ? e : this.state.multiSelectOptions });
    this.props.fetchOwnerProductProperties({
      token,
      from: startDate,
      to: endDate,
      currentPage: 1,
      perPage: 20,
      practiceType: e.length > 0 ? e : this.state.multiSelectOptions,
      filters: JSON.stringify(filterData),
      count: -1,
      state: selState,
      county: selCounty,
      zip,
      owners,
    });
  };
  onChangeZip = (e) => {
    const { token, startDate, endDate, practiceType, filterData, selState } =
      this.props;
    this.props.updateZip({ zip: e.target.value });
    this.props.fetchOwnerProductProperties({
      token,
      from: startDate,
      to: endDate,
      currentPage: 1,
      perPage: 20,
      practiceType,
      filters: JSON.stringify(filterData),
      count: -1,
      state: selState,
      county: "all",
      zip: e.target.value,
    });
  };
  onImport = () => {
    this.setState({ ...this.state, modalOpen: true });
  };

  onChangeState = (e) => {
    const {
      token,
      startDate,
      endDate,
      isFetching,
      practiceType,
      filterData,
      selState,
      selCounty,
      zip,
      owners
    } = this.props;
    this.props.updateState({ state: e.target.value });
    this.props.updateCounty({ county: "all" });
    this.props.fetchOwnerProductProperties({
      token,
      from: startDate,
      to: endDate,
      currentPage: 1,
      perPage: 20,
      practiceType,
      filters: JSON.stringify(filterData),
      count: -1,
      state: e.target.value,
      county: "all",
      zip,
      owners,
    });
  };

  onChangeCounty = (e) => {
    const {
      token,
      startDate,
      endDate,
      isFetching,
      practiceType,
      filterData,
      selState,
      zip,
    } = this.props;
    this.props.updateCounty({ county: e.target.value });
    this.props.fetchOwnerProductProperties({
      token,
      from: startDate,
      to: endDate,
      currentPage: 1,
      perPage: 20,
      practiceType,
      filters: JSON.stringify(filterData),
      count: -1,
      state: selState,
      county: e.target.value,
      zip,
    });
  };

  render() {
    const {
      startDate,
      endDate,
      practiceType,
      selState,
      selCounty,
      isFetching,
      zip,
      owners
    } = this.props;
    const { exporting } = this.state;
    const isGeoData = this.props.location.pathname === "/dashboard/geo-data";
    return (
      <header className="Header">
        <Logo />
        <ImportModal
          {...this.props}
          isOpen={this.state.modalOpen}
          onCloseModal={() => {
            this.setState({ ...this.state, modalOpen: false });
          }}
        />
        <div className="control-items">
          {!isGeoData && (
            <div className="control-items">
              <Link to="/dashboard/geo-data">
                <img
                  className="geo-data"
                  src="/geodata-logo.png"
                  alt="geo-data"
                />
              </Link>
              {/* <Input
                type="select"
                name="select"
                id="practiceTypeSelect"
                value={practiceType}
                onChange={this.onChangePracticeType}
              >
                <option value="all">All</option>
                <option value="preforeclosure">Preforeclosure</option>
                <option value="bankruptcy">Bankruptcy</option>
                <option value="tax-lien">Tax-lien</option>
                <option value="auction">Auction</option>
                <option value="child-support">Child Support</option>
                <option value="inheritance">Inheritance</option>
                <option value="probate">Probate</option>
                <option value="eviction">Eviction</option>
                <option value="hoa-lien">Hoa-lien</option>
                <option value="irs-lien">Irs-lien</option>
                <option value="mortgage-lien">Mortgage-lien</option>
                <option value="pre-inheritance">Pre-inheritance</option>
                <option value="pre-probate">Pre-probate</option>
                <option value="divorce">Divorce</option>
                <option value="tax-delinquency">Tax-delinquency</option>
                <option value="code-violation">Code-violation</option>
                <option value="absentee-property-owner">
                  Absentee-property-owner
                </option>
                <option value="vacancy">Vacancy</option>
                <option value="other-civil">Other Civil</option>
              </Input> */}
              <Multiselect
                options={this.state.multiSelectOptions} // Options to display in the dropdown
                selectedValues={this.state.selectedValues}
                id="practiceTypeSelect"
                onSelect={this.onChangePracticeType} // Function will trigger on select event
                onRemove={this.onChangePracticeType} // Function will trigger on remove event
                placeholder="All"
                isObject={false}
              />
              <Input
                type="text"
                name="zipField"
                placeholder="Zip Code"
                value={zip ? zip : ""}
                id="zipField"
                onChange={this.onChangeZip}
              />
              <Input
                type="select"
                name="stateSelect"
                id="stateSelect"
                value={selState}
                onChange={this.onChangeState}
              >
                <option value="all">All</option>
                {Object.keys(counties)
                  .sort()
                  .map((key) => (
                    <option value={key.toLowerCase()}>{key}</option>
                  ))}
              </Input>
              {selState !== "all" && (
                <Input
                  type="select"
                  name="countySelect"
                  id="countySelect"
                  value={selCounty}
                  onChange={this.onChangeCounty}
                >
                  <option value="all">all</option>
                  {counties[selState.toUpperCase()].map((key) => (
                    <option value={key}>{key}</option>
                  ))}
                </Input>
              )}
              <DateRangePicker
                initialSettings={{
                  startDate,
                  endDate,
                  ranges: {
                    Today: [moment().toDate(), moment().toDate()],
                    Yesterday: [
                      moment().subtract(1, "days").toDate(),
                      moment().subtract(1, "days").toDate(),
                    ],
                    "Last 7 Days": [
                      moment().subtract(6, "days").toDate(),
                      moment().toDate(),
                    ],
                    "Last 30 Days": [
                      moment().subtract(29, "days").toDate(),
                      moment().toDate(),
                    ],
                    "This Month": [
                      moment().startOf("month").toDate(),
                      moment().endOf("month").toDate(),
                    ],
                    "Last Month": [
                      moment().subtract(1, "month").startOf("month").toDate(),
                      moment().subtract(1, "month").endOf("month").toDate(),
                    ],
                    // 'Last Export':[
                    //   moment().toDate(),
                    //   moment().toDate()
                    // ],
                  },
                }}
                onCallback={this.onDateRangeCallback}
              >
                <input
                  type="text"
                  className="form-control"
                  style={{ width: "250px", margin: "0px 10px" }}
                />
              </DateRangePicker>
              <Button color="primary" onClick={this.onFetchData}>
                {isFetching ? "Fetching now..." : "Fetch Data"}
              </Button>
              <Button color="primary" onClick={this.onImport}>
                Import
              </Button>
              <Button color="primary" onClick={this.onExport}>
                {exporting ? "Exporting..." : "Export"}
              </Button>
              <Dropdown
                options={this.state.options}
                onChange={this.onSelect}
                value={this.state.value}
                placeholder="Layer Data"
              />
              ;
            </div>
          )}
          <Button color="danger" onClick={this.onLogout}>
            Logout
          </Button>
        </div>
      </header>
    );
  }
}

const mapStateToPros = (state) => {
  return {
    isFetching: state.ownerProductProperties.isFetching,
    startDate: state.ownerProductProperties.startDate,
    endDate: state.ownerProductProperties.endDate,
    token: state.auth.token,
    practiceType: state.ownerProductProperties.practiceType,
    filterData: state.ownerProductProperties.filterData,
    selState: state.ownerProductProperties.selState,
    selCounty: state.ownerProductProperties.selCounty,
    zip: state.ownerProductProperties.zip,
    owners: state.ownerProductProperties.owners,
  };
};
const mapDispatchToPros = (dispatch) => {
  return {
    fetchOwnerProductProperties: (data) => {
      dispatch(fetchOwnerProductProperties(data));
    },
    updateDateRange: (data) => {
      dispatch(updateDateRange(data));
    },
    deleteToken: () => {
      dispatch(deleteToken());
    },
    updatePracticeType: (data) => {
      dispatch(updatePracticeType(data));
    },
    updateState: (data) => {
      dispatch(updateState(data));
    },
    updateCounty: (data) => {
      dispatch(updateCounty(data));
    },
    updateZip: (data) => {
      dispatch(updateZip(data));
    },
    updateOwners: (data) => {
      dispatch(updateOwners(data));
    },
  };
};

export default connect(mapStateToPros, mapDispatchToPros)(Header);
