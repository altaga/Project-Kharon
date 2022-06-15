import React, { Component } from 'react';
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Input, Row } from 'reactstrap';
import '../assets/main.css';
import { connect } from 'react-redux';
import { set_contracturl_action } from "../redux/actions/syncActions/updateContractUrlaction"
import { set_pubkey_action } from "../redux/actions/syncActions/updatePublicKeyaction"
import { set_activetab_action } from '../redux/actions/syncActions/setActiveTabaction';
import autoBind from 'react-autobind';
import Header from '../components/header';
import QrReader from 'react-qr-reader'
import logoETH from '../assets/logo-ether.png'
import Chart from '../components/chart';
import QRCode from "react-qr-code";

const bs58 = require('bs58')
const webs3 = require('@solana/web3.js');
let connection = new webs3.Connection(webs3.clusterApiUrl('devnet'), 'confirmed');

function ipfsTohtml(uri) {
    let substring = uri.substring(0, uri.lastIndexOf('/')).replace("ipfs://", 'https://')
    let substring2 = uri.substring(uri.lastIndexOf('/'), uri.length).replace("/", '.ipfs.dweb.link/')
    return substring + substring2
}

function timestampToDate(timestamp) {
    return new Date(timestamp).toLocaleString()
}

class Scan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cameraId: "environment",
            spaceQR: "inline",
            devices: ["back", "frontal"],
            delay: 200,
            loading: false,
            res: "",
            address: "",
            owners: [],
            datas: {
                dataDate: [],
                data: []
            },
            solAddress: "",
        }
        autoBind(this);
        this.unirest = require('unirest');
    }

    componentDidMount() {
        /*
        this.setState({
            spaceQR: "none",
            loading: true
        })
        this.checkDisplay("0xB988152B895E6348b2d7E7Ff2D1CeD166c3737A7")
        */
    }

    handleScan(data) {
        if (data !== null && data !== undefined && this.state.spaceQR !== "none") {
            this.setState({
                spaceQR: "none",
                loading: true
            })
            this.checkDisplay(data)
        }
    }

    checkDisplay(addr) {
        let self = this;
        this.unirest('GET', `https://deep-index.moralis.io/api/v2/nft/${addr}?chain=mumbai&format=hex&order=DESC`)
            .headers({
                'accept': 'application/json',
                'X-API-Key': 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx'
            })
            .end(async (resp) => {
                if (resp.error) throw new Error(resp.error);
                let base58publicKey = new webs3.PublicKey("3nLn234eZzG81fhHRj4kWg4X3Ng5jz1JA1YPy5crgppZ");
                let res = await connection.getSignaturesForAddress(base58publicKey)
                res = await connection.getTransactions(res.map(x => x.signature))
                let temp = []
                res.forEach(x => {
                    if (x.transaction.message.accountKeys[1] === "JBRHgSaVSf9PNLVFBgyaFnqsEE4293e7GQnbDq9YgwU5") {
                        temp.push(x)
                    }
                })
                let temps = {
                    data: [],
                    dataDate: []
                }
                temp.forEach(x => {
                    try {
                        let data = Buffer.from(bs58.decode(x.transaction.message.instructions[0].data)).toString('utf8').split(",")
                        if (data.length > 2) {
                            if (temps.data.length < 5) {
                                temps.data.push(data)
                                temps.dataDate.push(x.blockTime)
                            }
                        }
                    }
                    catch (e) {
                        console.log(e)
                    }
                })
                temps.data = temps.data.reverse()
                temps.dataDate = temps.dataDate.reverse()
                console.log(temps)
                this.setState({
                    datas: temps,
                    spaceQR: "none",
                    loading: false,
                    res: JSON.parse(resp.body.result[0].metadata),
                    address: addr
                })
            });
        this.unirest('GET', `https://deep-index.moralis.io/api/v2/${addr}?chain=mumbai`)
            .headers({
                'accept': 'application/json',
                'X-API-Key': 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx'
            })
            .end((res) => {
                if (res.error) throw new Error(res.error);
                let owners = []
                let temp = res.body.result
                for (let i = 0; i < temp.length; i++) {
                    if (i === temp.length - 1) {
                        temp[i].event = "Mint"
                        owners.push(temp[i])
                    }
                    else if (temp[i].value > "0") {
                        temp[i].event = "Transfer"
                        owners.push(temp[i])
                    }
                }
                owners = owners.reverse()
                let ownArr = []
                for (let i = 0; i < owners.length; i++) {
                    ownArr.push(owners[i].from_address)
                }
                for (let i = 1; i < owners.length; i++) {
                    owners[i].from_address = ownArr[i - 1]
                    owners[i].to_address = ownArr[i]
                }
                owners = owners.reverse()
                self.setState({
                    owners: owners
                })
            });

    }

    handleError(err) {
        // Nothing
    }

    camSelect(event) {
        let temp = "environment"
        if (event.target.value === "frontal") {
            temp = "user"
        }
        this.setState({
            cameraId: temp
        })
    }

    render() {
        let previewStyle = {
            width: "100%"
        }
        return (
            <div className="App">
                <Header />
                <div className="body-style2" style={{ fontSize: "1.5rem" }} id="body-style">
                    <div style={{ padding: "20px" }}>
                        <Row>
                            <Col xs="5">
                                {
                                    this.state.spaceQR === "inline" ?
                                        <div style={{ width: "80%" }} className="center-element">
                                            <Input style={previewStyle} onChange={this.camSelect} type="select" name="select" id="cameraSelect">
                                                {
                                                    this.state.devices.map((number, index) => <option key={index}>{number}</option>)
                                                }
                                            </Input>
                                            <QrReader
                                                delay={this.state.delay}
                                                style={previewStyle}
                                                onError={this.handleError}
                                                onScan={this.handleScan}
                                                facingMode={this.state.cameraId}
                                            />
                                        </div>
                                        :
                                        <div style={{ width: "80%" }} className="center-element">
                                            {
                                                this.state.res !== "" &&
                                                <>
                                                    <img style={{ maxHeight: "66vh", width: "70%", borderRadius: "10px", border: "1px solid #bbb" }} src={ipfsTohtml(this.state.res.image)} alt="images"/>
                                                    <br />
                                                    <br />
                                                    <QRCode value={this.state.address} />
                                                    <br />
                                                    <br />
                                                </>
                                            }
                                        </div>
                                }
                            </Col>
                            <Col xs="7">
                                <div>
                                    {
                                        this.state.spaceQR === "inline" ?
                                            <div style={{ width: "80%" }} className="center-element">
                                            </div>
                                            :
                                            <div style={{ width: "100%" }}>
                                                {
                                                    this.state.res !== "" &&
                                                    <div>
                                                        <Card style={{}}>
                                                            <CardHeader>
                                                                Product Name: {this.state.res.name}
                                                                <p />

                                                            </CardHeader>
                                                            <CardBody>
                                                                Description: {this.state.res.description}
                                                                <p />
                                                            </CardBody>
                                                            <CardFooter>
                                                                <Row>
                                                                    <Col xs="6">
                                                                        Brand: {this.state.res.attributes[0].brand}
                                                                    </Col>
                                                                    <Col xs="6">
                                                                        Year: {this.state.res.attributes[0].release_date}
                                                                    </Col>
                                                                </Row>
                                                            </CardFooter>
                                                        </Card>
                                                        <p />
                                                        <div style={{ marginTop: "5vh", marginBottom: "2vh" }} className="myhr2" />
                                                        <Chart location={[19.42,-99.12]} data={this.state.datas} address={this.state.solAddress} />
                                                        <div style={{ marginTop: "5vh", marginBottom: "2vh" }} className="myhr2" />
                                                        <p />
                                                        <Row>
                                                            <Col>
                                                                <Button style={{ width: "60%", height: "100%", borderRadius: "25px", fontSize: "1.5rem", background: ` #474dff` }} onClick={() => window.open(`https://mumbai.polygonscan.com/address/${this.state.address}`, "_blank")}>
                                                                    <div style={{ fontSize: "0.8rem", fontWeight: "bolder" }}>
                                                                        View on
                                                                    </div>
                                                                    <img src={logoETH} alt="logoeth" width="100%" />
                                                                </Button>
                                                            </Col>
                                                            <Col>
                                                                <Button style={{ width: "60%", height: "100%", borderRadius: "25px", fontSize: "1.5rem", background: ` #474dff` }} onClick={() => window.open(this.state.res.external_url, "_blank")}>Brand URL</Button>
                                                            </Col>
                                                        </Row>
                                                        <div style={{ marginTop: "5vh", marginBottom: "2vh" }} className="myhr2" />
                                                        <p />
                                                        <h3>
                                                            Owner:
                                                        </h3>
                                                        <p />
                                                        <Card style={{ fontSize: "1rem" }}>
                                                            <Row md={5}>
                                                                <Col>
                                                                    Event
                                                                </Col>
                                                                <Col>
                                                                    Price
                                                                </Col>
                                                                <Col>
                                                                    From
                                                                </Col>
                                                                <Col>
                                                                    To
                                                                </Col>
                                                                <Col>
                                                                    Date
                                                                </Col>
                                                            </Row>

                                                            {
                                                                this.state.owners.map((owner, index) =>
                                                                    <Row md={5} key={index}>
                                                                        <Col>
                                                                            {owner.event}
                                                                        </Col>
                                                                        <Col>
                                                                            {owner.value / 1000000000000000000} MATIC
                                                                        </Col>
                                                                        <Col>
                                                                            <a href={`https://mumbai.polygonscan.com/address/${owner.from_address}`}>{owner.from_address.substring(0, 5)}...{owner.from_address.substring(owner.from_address.length - 5, owner.from_address.length)}</a>
                                                                        </Col>
                                                                        <Col>
                                                                            <a href={`https://mumbai.polygonscan.com/address/${owner.to_address}`}>{owner.to_address.substring(0, 5)}...{owner.to_address.substring(owner.to_address.length - 5, owner.to_address.length)}</a>
                                                                        </Col>
                                                                        <Col>
                                                                            {timestampToDate(Date.parse(owner.block_timestamp))}
                                                                        </Col>
                                                                    </Row>
                                                                )
                                                            }
                                                        </Card>
                                                    </div>
                                                }
                                            </div>
                                    }
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        );
    }
}
const mapDispatchToProps =
{
    set_contracturl_action,
    set_pubkey_action,
    set_activetab_action
}

const mapStateToProps = (state) => {
    return {
        my_contracturl: state.my_contracturl,
        my_pubkey: state.my_pubkey,
        my_ipfslink: state.my_ipfslink,
        my_activetab: state.my_activetab,
        my_nft: state.my_nft
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Scan);