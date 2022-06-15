import React, { Component } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Card, CardBody, CardFooter, Col, Row } from 'reactstrap';
import Solana from '../assets/bitmap.png';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

class Chart extends Component {
    render() {
        let labels = this.props.data.dataDate.map(item => `${new Date(item * 1000).toLocaleTimeString()}`);
        let datas = this.props.data.data
        const data = {
            labels,
            datasets: [
                {
                    label: 'Temperature (°C)',
                    data: datas.map(item => item[1]),
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                },
                {
                    label: 'Humidity (%)',
                    data: datas.map(item => item[2]),
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                },
            ],
        };


        const options = {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Product Last 5 checkpoints'
                },
            },
        };
        return (
            <Row>
                <Col style={{ width: "60%" }}>
                    <Bar options={options} data={data} />
                    <p />
                    <div style={{ fontSize: "1.2rem" }}>
                        Last location of the product.
                        <div>
                            {"Lat: " + this.props.location[0]}
                        </div>
                        <div>
                            {"Lon: " + this.props.location[1]}
                        </div>
                    </div>
                </Col>
                <Col style={{ width: "40%" }}>
                    <Card style={{ fontSize: "1.4rem" }}>
                        <CardBody>
                            Solana Tracking account
                        </CardBody>
                        <CardFooter>
                            <div>
                                Solana Explorer {"\n"}
                            </div>
                            <div>
                                <img src={Solana} alt="solana" style={{ width: "100px" }} />
                            </div>
                            <a href={`https://explorer.solana.com/address/${this.props.address}?cluster=devnet`} target="_blank" rel="noopener noreferrer">
                                <div>
                                    {this.props.address.substring(0, 22)}
                                </div>
                                <div>
                                    {this.props.address.substring(22, 44)}
                                </div>
                            </a>
                        </CardFooter>
                    </Card>
                </Col>
            </Row>
        );
    }
}

export default Chart;
