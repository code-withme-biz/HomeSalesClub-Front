
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Input,Label,InputGroup, InputGroupAddon,InputGroupText} from 'reactstrap';
import React from 'react';
import counties from './counties.json';
import axios from 'axios';
import { data } from 'jquery';



class ImportModal extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            state:"fl",
            practiceType:"eviction",
            county:"broward",
            file:null,
        };
    }
    onPressCancel= () => {
        this.props.onCloseModal();
    }
    onChangeState= (e) => {
        this.setState({...this.state,state:e.target.value});
    }
    onImport = async (e) => {
        const {token} = this.props;
        const {county,practiceType,state,file} = this.state;
        const endpoint = process.env.REACT_APP_NODE_ENV === 'development' ?
            process.env.REACT_APP_API_DEV : process.env.REACT_APP_API_PROD;

        const formData = new FormData();
        formData.append("state",state);
        formData.append("county",county);
        formData.append("practiceType",practiceType);
        if(file) {
            formData.append("file",file,file.name);
        }

        try{
            const url =`${endpoint}/import?token=${token}`
            let response = await axios.post(url,formData);
            console.log(response);

        }catch(e){
            alert("Error during Import");
            console.log(e);
        }
        this.props.onCloseModal();
    }
    onChangeCounty = (e) => {
        this.setState({...this.state,county:e.target.value});
    }
    onChangePracticeType = (e) => {
        this.setState({...this.state,practiceType:e.target.value});
    }
    onUploadFile = (e) => {
        this.setState({...this.state,file:e.currentTarget.files[0]});
    }
    render() {
        const {isOpen} = this.props;
        const {state,practiceType,county} = this.state;
        return <Modal isOpen={isOpen} className="add-geodata-modal">
            <ModalBody>
                <Label for="practiceType">Practice Type</Label>
                <Input
                    type="select"
                    label=""
                    placeholder="Practice Type"
                    value={practiceType}
                    id="practiceType"
                    onChange={this.onChangePracticeType}
                >
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
                    <option value="absentee-property-owner">Absentee-property-owner</option>
                    <option value="vacancy">Vacancy</option>
                    <option value="criminal">Criminal</option>
                    <option value="civil">Civil</option>
                    <option value="traffic">Traffic</option>
                    <option value="foreclosure">Foreclosure</option>
                    <option value="marriage">Marriage</option>
                </Input>
                <Label for="state">State</Label>
                <Input
                    type="select"
                    label=""
                    placeholder="State"
                    value={state}
                    id="state"
                    onChange={this.onChangeState}
                >
                       {Object.keys(counties)
                            .sort()
                            .map(key => <option value={key.toLowerCase()}>{key}</option>
                       )}
                </Input>
                {state !== 'all' && counties[state.toUpperCase()] && <React.Fragment>
                    <Label for="county">County</Label>
                    <Input
                        type="select"
                        label=""
                        placeholder="County"
                        value={county}
                        id="county"
                        onChange={this.onChangeCounty}
                    >
                     {counties[state.toUpperCase()].map(key => <option value={key}>{key}</option>)}
                    </Input>
                </React.Fragment>}
                <div style={{marginBottom:"5px"}}></div>
                <Input
                    type="file"
                    placeholder="file"
                    onChange={this.onUploadFile}
                />
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={this.onImport} disabled={!this.state.file}>Import</Button>
                <Button color="secondary" onClick={this.onPressCancel}>Cancel</Button>
            </ModalFooter>
        </Modal>
    }
}

export default ImportModal;
