// Basic imports
import '../assets/main.css';
import '../assets/fontawesome.min.css'
import { Component } from 'react';
import autoBind from 'react-autobind';
import Header from '../components/header';
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Input, Row } from 'reactstrap';
import { Grid } from 'react-loading-icons';
import { set_pubkey_action } from "../redux/actions/syncActions/updatePublicKeyaction"
import { connect } from 'react-redux';
import { abi } from '../contracts/nftContract';
import logoPoly from '../assets/logo-ether.png'
import Web3 from 'web3';
import Chart from '../components/chart';
import QRCode from "react-qr-code";

const bs58 = require('bs58')
const webs3 = require('@solana/web3.js');
let connection = new webs3.Connection(webs3.clusterApiUrl('devnet'), 'confirmed');

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const dataweb3 = createAlchemyWeb3("https://polygon-mumbai.g.alchemy.com/v2/XXXXXXXXXXXXXXXXXXXXXXXXx");

function timestampToDate(timestamp) {
    return new Date(timestamp).toLocaleString()
}

class Nft extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: false,
            extra_info: false,
            price: "0",
            actualAddress: "",
            increaseState: false,
            bid: "0",
            contract: "",
            account: "",
            extraData: {},
            status: true,
            image_url: "",
            youtube: "",
            long: "",
            owners: [],
            nftrev: false,
            datas: [],
            address: "3nLn234eZzG81fhHRj4kWg4X3Ng5jz1JA1YPy5crgppZ",
            location: [],
            memLocation: [],
            lat: 0,
            lng: 0,
        }
        autoBind(this);
        this.unirest = require('unirest');
        this.web3 = new Web3(window.ethereum);
        this.url_params = new URLSearchParams(this.props.location.search)
    }

    async componentDidMount() {
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
        this.setState({
            datas: temps
        })
        this.unirest('POST', 'https://us-south.functions.appdomain.cloud/api/v1/web/Blankit/default/GetProductsByPubKey')
            .headers({
                'Content-Type': 'application/json'
            })
            .send(JSON.stringify({
                'pubkey': this.props.match.params.pub
            }))
            .end((res) => {
                if (res.error) throw new Error(res.error);
                if (res.body.length > 0) {
                    console.log(res.body)
                    let temp = res.body[this.url_params.get('id')].data;
                    temp["url"] = res.body[this.url_params.get('id')].url;
                    const mint_contract = new dataweb3.eth.Contract(abi(), res.body[this.url_params.get('id')].contract);
                    let addr = res.body[0].contract
                    let self = this;
                    this.unirest('GET', `https://deep-index.moralis.io/api/v2/${addr}?chain=mumbai`)
                        .headers({
                            'accept': 'application/json',
                            'X-API-Key': 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx'
                        })
                        .end((res) => {
                            if (res.error) throw new Error(res.error);
                            let owners = []
                            let temps = res.body.result
                            for (let i = 0; i < temps.length; i++) {
                                if (i === temps.length - 1) {
                                    temps[i].event = "Mint"
                                    owners.push(temps[i])
                                }
                                else if (temps[i].value >= "0") {
                                    temps[i].event = "Transfer"
                                    owners.push(temps[i])
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
                    this.setState({
                        data: temp,
                        extra_info: res.body[this.url_params.get('id')],
                        contract: res.body[this.url_params.get('id')].contract
                    });
                    mint_contract.methods.price().call().then(price => {
                        this.setState({
                            price: price,
                            bid: price
                        });
                    });
                    mint_contract.methods.location().call().then(location => {
                        this.setState({
                            location: JSON.parse(location)
                        });
                    });
                    mint_contract.methods.mem_location().call().then(memlocation => {
                        try {
                            this.setState({
                                memLocation: JSON.parse(memlocation)
                            });
                        }
                        catch (e) {
                            this.setState({
                                memLocation: ""
                            });
                        }
                    });
                    mint_contract.methods.flag().call().then(status => {
                        this.setState({
                            status: status
                        });
                    });
                    mint_contract.methods.owner().call().then(actualAddress => {
                        this.setState({
                            actualAddress: actualAddress
                        });
                    });
                }
            });
    }

    setNewLocation() {
        const mint_contract = new this.web3.eth.Contract(abi(), this.state.contract, { from: this.props.my_pubkey.pubkey });
        mint_contract.methods.setLocation(`[${this.state.lat},${this.state.lng}]`).send().on('confirmation', (confirmationNumber, receipt) => {
            window.location.reload()
        }
        )
    }

    changeLocation() {
        const mint_contract = new this.web3.eth.Contract(abi(), this.state.contract, { from: this.props.my_pubkey.pubkey });
        mint_contract.methods.changeLocation(JSON.stringify(this.state.memLocation)).send().on('confirmation', (confirmationNumber, receipt) => {
            window.location.reload()
        }
        )
    }

    render() {
        return (
            <div className="App" style={{ overflowX: "hidden" }}>
                <Header />
                {
                    this.state.data ?
                        <div className="body-style2" id="body-style">
                            <div>
                                <Row>
                                    <Col xs={5}>
                                        <div style={{ width: "80%" }} className="center-element">
                                            <img style={{ maxHeight: "66vh", width: "70%", borderRadius: "10px", border: "1px solid #bbb" }} src={`${this.state.data["url"]}`} alt="Card images cap" />
                                        </div>
                                        <br></br>
                                        <div>
                                            <QRCode value={this.state.contract} />
                                        </div>
                                    </Col>
                                    <Col xs={7}>
                                        <div style={{ textAlign: "center", paddingTop: "20px" }}>
                                            <div>
                                                <Card style={{ fontSize: "1.5rem" }}>
                                                    <CardHeader>
                                                        Product Name: {this.state.data.name}
                                                        <p />

                                                    </CardHeader>
                                                    <CardBody>
                                                        Description: {this.state.data.description}
                                                        <p />
                                                    </CardBody>
                                                    <CardFooter>
                                                        <Row>
                                                            <Col xs="6">
                                                                Brand: {this.state.data.attributes[0].brand}
                                                            </Col>
                                                            <Col xs="6">
                                                                Tracking Start: {this.state.data.attributes[0].tracking_date}
                                                            </Col>
                                                        </Row>
                                                    </CardFooter>
                                                </Card>
                                                <div style={{ marginTop: "5vh", marginBottom: "2vh" }} className="myhr2" />
                                                <Chart
                                                    location={[19.42, -99.12]}
                                                    data={this.state.datas}
                                                    address={this.state.address}
                                                />
                                                <div style={{ marginTop: "5vh", marginBottom: "2vh" }} className="myhr2" />
                                                <br />
                                                <Row>
                                                    <Col>
                                                        <Button style={{ width: "60%", height: "100%", borderRadius: "25px", fontSize: "1.5rem", background: ` #474dff` }} onClick={() => window.open(`https://mumbai.polygonscan.com/address/${this.state.contract}`, "_blank")}>
                                                            <div style={{ fontSize: "0.8rem", fontWeight: "bolder" }}>
                                                                View on
                                                            </div>
                                                            <img src={logoPoly} alt="logoPoly" width="100%" />
                                                        </Button>
                                                    </Col>
                                                    <Col>
                                                        {
                                                            ((this.props.my_pubkey.pubkey.toLowerCase() !== '') && (this.state.actualAddress.toLowerCase() !== this.props.my_pubkey.pubkey.toLowerCase())) ?
                                                                <>
                                                                    {
                                                                        JSON.stringify(this.state.memLocation) !== JSON.stringify(this.state.location) ?
                                                                            <>
                                                                                {"Wating for approve"}
                                                                            </>
                                                                            :
                                                                            <>
                                                                                <Input type="number" name="Latitude" placeholder="Latitude" onChange={(event) => {
                                                                                    this.setState({
                                                                                        lat: event.target.value
                                                                                    });
                                                                                }} />
                                                                                <Input type="number" name="Longitude" placeholder="Longitude" onChange={(event) => {
                                                                                    this.setState({
                                                                                        lng: event.target.value
                                                                                    });
                                                                                }} />
                                                                                <p />
                                                                                <Button style={{ width: "60%", borderRadius: "25px", fontSize: "1.5rem", background: ` #474dff` }} onClick={() => this.setNewLocation()}>Set new location</Button>
                                                                            </>

                                                                    }
                                                                </>
                                                                :
                                                                <>
                                                                    <h3>
                                                                        {
                                                                            this.state.memLocation !== "" ?
                                                                                <>
                                                                                    {
                                                                                        JSON.stringify(this.state.memLocation) !== JSON.stringify(this.state.location) ?
                                                                                            <>
                                                                                                {
                                                                                                    (this.state.actualAddress.toLowerCase() === this.props.my_pubkey.pubkey.toLowerCase()) ?
                                                                                                        <>
                                                                                                            <div style={{ fontSize: "1rem" }}>
                                                                                                                {this.state.actualAddress} <p /> set new location
                                                                                                                <p />{JSON.stringify(this.state.memLocation)}
                                                                                                            </div>
                                                                                                            <p />
                                                                                                            <div>
                                                                                                                <Button style={{ width: "60%", borderRadius: "25px", fontSize: "1.5rem", background: ` #474dff` }} onClick={() => {
                                                                                                                    this.changeLocation()
                                                                                                                }}>Approve new location</Button>
                                                                                                            </div>
                                                                                                        </>
                                                                                                        :
                                                                                                        <>
                                                                                                            {"Waiting for approve"}
                                                                                                        </>
                                                                                                }
                                                                                            </>
                                                                                            :
                                                                                            <>
                                                                                                {"Waiting for new location"}
                                                                                            </>
                                                                                    }
                                                                                </>
                                                                                :
                                                                                <>
                                                                                    {"Waiting for new location"}
                                                                                </>
                                                                        }
                                                                    </h3>
                                                                </>
                                                        }
                                                    </Col>
                                                </Row>
                                                <p />
                                                <h3>
                                                    Owner:
                                                </h3>
                                                <p />
                                                <Card style={{ fontSize: "1rem", border: "gray 1px solid" }}>
                                                    <Row md={4}>
                                                        <Col>
                                                            Event
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
                                                    <p />
                                                    {
                                                        this.state.owners.map((owner, index) =>
                                                            <Row md={4} key={index}>
                                                                <Col>
                                                                    {owner.event}
                                                                </Col>
                                                                <Col>
                                                                    <a href={`https://mumbai.polygonscan.com/address/${owner.from_address}`}>{owner.from_address.substring(0, 10)}...{owner.from_address.substring(owner.from_address.length - 10, owner.from_address.length)}</a>
                                                                </Col>
                                                                <Col>
                                                                    <a href={`https://mumbai.polygonscan.com/address/${owner.to_address}`}>{owner.to_address.substring(0, 10)}...{owner.to_address.substring(owner.to_address.length - 10, owner.to_address.length)}</a>
                                                                </Col>
                                                                <Col>
                                                                    {timestampToDate(Date.parse(owner.block_timestamp))}
                                                                </Col>
                                                            </Row>
                                                        )
                                                    }
                                                </Card>
                                                <p></p>
                                                <p></p>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                        :
                        <>
                            <div className="body-style">
                                <div style={{ paddingTop: "25vh" }}>
                                    <Grid fill="#474dff" />
                                </div>
                            </div>
                        </>
                }
            </div>
        );
    }
}

const mapDispatchToProps =
{
    set_pubkey_action,
}

const mapStateToProps = (state) => {
    return {
        my_pubkey: state.my_pubkey,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Nft);