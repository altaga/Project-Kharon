// Basic imports
import '../assets/main.css';
import { Component } from 'react';
import autoBind from 'react-autobind';
import Footer from '../components/footer';
import Header from '../components/header';
import { Button, Card, CardBody, CardImg, CardText, CardTitle, Col, ListGroup, ListGroupItem, Row } from 'reactstrap';
import { abi } from '../contracts/nftContract';
import one from "../assets/Icons/1.png"
import two from "../assets/Icons/2.png"
import three from "../assets/Icons/3.png"
import four from "../assets/Icons/4.png"
import five from "../assets/Icons/5.png"
import six from "../assets/Icons/6.png"

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const dataweb3 = createAlchemyWeb3("https://polygon-mumbai.g.alchemy.com/v2/XXXXXXXXXXXXXXXXXXXXXXXXx");

function shuffle(inArray) {
  let tempArray = inArray;
  for (let i = tempArray.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = tempArray[i];
    tempArray[i] = tempArray[j];
    tempArray[j] = temp;
  }
  return tempArray;
}


class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      elements: [],
      brand: {},
      prices: [],
      status: [],
      search: "",
      searchElements: [],
      searchResults: [],
    }
    autoBind(this);
    this.unirest = require('unirest');
  }

  async componentDidMount() {
    this.unirest('GET', 'https://us-south.functions.appdomain.cloud/api/v1/web/Blankit/default/GetAllProducts')
      .end((res) => {
        if (res.error) throw new Error(res.error);
        console.log(res.body);
        if (res.body.length > 0) {
          let temp = this.state.brand;
          let temp2 = res.body;
          let temp3 = []
          let temp4 = []
          for (let i = 0; i < res.body.length; i++) {
            if (temp[res.body[i]["pubkey"]] === undefined) {
              temp[res.body[i]["pubkey"]] = 0;
            }
            else {
              temp[res.body[i]["pubkey"]]++;
            }
            temp2[i]["counter"] = temp[res.body[i]["pubkey"]]
            temp3.push("0")
            temp4.push(res.body[i])
            temp2[i]["index"] = i
          }
          this.setState({
            elements: shuffle(temp2),
            prices: temp3,
            searchElements: temp4,
          }, () => {
            for (let i = 0; i < res.body.length; i++) {
              this.updatePrice(res.body[i]["contract"], i)
            }
          });
        }
      });
  }

  updatePrice(contract, id) {
    const mint_contract = new dataweb3.eth.Contract(abi(), contract);
    mint_contract.methods.flag().call().then(status => {
      let temp = this.state.status;
      temp[id] = status;
      this.setState({
        status: temp
      });
    });
    mint_contract.methods.price().call().then(price => {
      let temp = this.state.prices;
      temp[id] = price;
      this.setState({
        prices: temp
      });
    });
  }

  render() {
    return (
      <div className="App" style={{ overflowX: "hidden" }}>
        <Header />
        <div className="body-style" id="body-style" style={{ overflowX: "hidden", overflowY: "hidden" }}>
          <div>
            <Row style={{ paddingBottom: "13vh" }}>
              <Col style={{ paddingTop: "14vh", paddingLeft: "12vw", color: "#474dff" }}>
                <h1 style={{ fontWeight: "bold", fontSize: "4rem" }}>Welcome to
                  Kharon Protocol
                </h1>
                <h5>
                  <p />NFTizing and connecting blockchains with the Internet of Things.
                </h5>
                <br />
                <Row>
                  <Col>
                    <div style={{ height: "20px" }}>
                      {
                        this.state.searchResults.length > 0 &&
                        <ListGroup style={{ paddingLeft: "8%", overflowY: "scroll", height: "18vh", width: "67%" }}>PubKey
                          {
                            this.state.searchResults.map((element) => {
                              return (
                                <ListGroupItem style={{ textAlign: "justify" }}>
                                  <a className="nostyle" href={`/nft/${element.pubkey}?id=${element.counter}`}>
                                    {
                                      "NFT: " + element.data.name + ", brand: " + element.data.attributes[0].brand
                                    }
                                  </a>
                                </ListGroupItem>
                              )
                            })
                          }
                        </ListGroup>
                      }
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col>
                <div className="background-images" />
              </Col>
            </Row>
            <br />
            <div className="myhr2" />
            <div style={{ paddingTop: "4vh" }}>
              <h1>
                Popular products
              </h1>
            </div>
            <br />
            <div className="flexbox-style">
              {
                this.state.elements.map((item, index) => {
                  if (index < 3) {
                    return (
                      <div key={"element" + index} style={{ margin: "10px", height: "74vh" }}>
                        <Card id={"cards" + index} style={{ width: "20vw", height: "74vh", border: "#474dff 1px solid" }}>
                          <div style={{ opacity: "100%", textAlign: "center", paddingTop: "10px" }} >
                            <CardImg style={{ width: "190px", height: "190px", borderRadius: "10px", border: "#474dff 1px solid" }} top src={item.url} alt="Card image cap" />
                          </div>
                          <br />
                          <CardBody>
                            <CardTitle tag="h5">{item.data.attributes[0].brand}</CardTitle>
                            <br />
                            <div style={{ overflowY: "hidden", height: "100%" }}>
                              <CardText >
                                {
                                  item.data.description.length > 150 ?
                                    item.data.description.substring(0, 150) + "..." :
                                    item.data.description
                                }
                              </CardText>
                            </div>
                            <br />
                            <div className="flexbox-style">
                              <div style={{ position: "absolute", bottom: "2vh" }}>
                                <Button style={{ width: "200px", borderRadius: "25px", fontSize: "1.3rem", background: ` #474dff` }} onClick={() => {
                                  window.open(`/nft/${item.pubkey}?id=${item.counter}`, "_blank");
                                }}>Open Product</Button>
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      </div>
                    )
                  }
                  else {
                    return null
                  }
                })
              }
            </div>
            <br />
            <br />
            <div className="myhr2" />
            <div style={{ paddingTop: "4vh" }}>
              <div>
                <h1>
                  NFTize everything!
                </h1>
              </div>
              <Row md="3" style={{ padding: "4vh" }}>
                <Col>
                  <div style={{ paddingBottom: "10px" }}>
                    <CardImg style={{ width: "190px", height: "190px", borderRadius: "10px", border: "#474dff 1px solid" }} top src={one} alt="Card image cap" />
                  </div>
                  <div style={{ padding: "0px 20px 0px 20px" }}>
                    Validated and verified through Polygon.
                  </div>
                </Col>
                <Col>
                  <div style={{ paddingBottom: "10px" }}>
                    <CardImg style={{ width: "190px", height: "190px", borderRadius: "10px", border: "#474dff 1px solid" }} top src={two} alt="Card image cap" />
                  </div>
                  <div style={{ padding: "0px 20px 0px 20px" }}>
                    NFT real world assets.
                  </div>
                </Col>
                <Col>
                  <div style={{ paddingBottom: "10px" }}>
                    <CardImg style={{ width: "190px", height: "190px", borderRadius: "10px", border: "#474dff 1px solid" }} top src={three} alt="Card image cap" />
                  </div>
                  <div style={{ padding: "0px 20px 0px 20px" }}>
                    Track your parcels.
                  </div>
                </Col>
                <Col>
                  <div style={{ paddingBottom: "10px", paddingTop: "20px" }}>
                    <CardImg style={{ width: "190px", height: "190px", borderRadius: "10px", border: "#474dff 1px solid" }} top src={four} alt="Card image cap" />
                  </div>
                  <div style={{ padding: "0px 20px 0px 20px" }}>
                    We handle everything with cryptographic security.
                  </div>
                </Col>
                <Col>
                  <div style={{ paddingBottom: "10px", paddingTop: "20px" }}>
                    <CardImg style={{ width: "190px", height: "190px", borderRadius: "10px", border: "#474dff 1px solid" }} top src={five} alt="Card image cap" />
                  </div>
                  <div style={{ padding: "0px 20px 0px 20px" }}>
                    You can check the provenance of the products through polygon scan.
                  </div>
                </Col>
                <Col>
                  <div style={{ paddingBottom: "10px", paddingTop: "20px" }}>
                    <CardImg style={{ width: "190px", height: "190px", borderRadius: "10px", border: "#474dff 1px solid" }} top src={six} alt="Card image cap" />
                  </div>
                  <div style={{ padding: "0px 20px 0px 20px" }}>
                    We are always available to answer any and every question regarding our Products
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Main;