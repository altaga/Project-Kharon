
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [<img src="https://img.shields.io/badge/View-Website-blue">](https://www.kharonprotocol.com/) [<img src="https://img.shields.io/badge/View-Video-red">]([PENDING](https://youtu.be/h4nL_1s9dzI))

#### Live: https://www.kharonprotocol.com/

Socials:

https://www.facebook.com/KharonProtocol

https://twitter.com/KharonProtocol

### Main Video!: https://youtu.be/h4nL_1s9dzI

# Project-Kharon

<img src="https://i.ibb.co/ChpKBM4/logo-6.png">

Kharon is a platform that NFTizes offline assets and connects blockchains with the Internet of Things, powered by Polygon, Solana and Chainlink


## Introduction and Problem Statement

The challenge for the first accelerator of the Call for code is to Improve supply chain transparency and traceability to bring fast and accurate visibility to sustainability issues where they arise.

“Disruptions to the supply chain aren’t over yet. It is predicted that supply chain issues facing the United States will continue into 2022 citing demand as one of the top contributors.”

<img src="https://www.3plcentral.com/hubfs/3PL%20Central/Lp%20Image/Supply%20Chain%20Disruptions%20.png"> 

- Supply chain issues have been made much worse by the COVID-19 pandemic.
- The economic environment has become more challenging, and sustainability is being emphasized.

Among the worse effects, the computer chip shortage had a profound effect across many industries including automotive, manufacturing and many others. Concerns have also been raised about everything from lithium supply for electric vehicle batteries to restaurant food supplies to even coffee shortages.


We need a way to improve on all these issues.


<hr/>

## Our Solution

NFTizing offline assets and joining IoT with Blockchain, but without the downside.

Namely the Solana blockchain with its speed and ease of development and the huge infrastructure of the Helium Network with its more than one hundred and eighty thousand LoRa Hotspots around the world.

<img src="https://i.ibb.co/68yKS1h/interoperability.png" width="400">

In addition to that we are incorporating Polygon as it is a better alternative to mint and host NFT while at the same time combining it with IPFS/Filecoin for the data storage, retrieval and management of smart contracts.

IoT comes with several  use cases in different sectors, however, its wider application is caught sometimes behind security concerns over data storage or on the device itself. Will combining it with blockchain be the answer to all its woes? Our answer is yes, as the projects trying to tackle these problems surely reflect. But they all come with their set of drawbacks that must be tackled along the way.

Blockchain can Bring to the table Decentralization of data, added Security, which is perhaps one of the greatest woes of IoT. Transparency: as anyone would be able to check the blockchain at any time. Autonomy, as the Blockchain reinforces machine to machine economies through a token. And reduced costs as there are already great projects around with huge infrastructure.

<img src="https://i.ibb.co/sKz6VG8/vlcsnap-2021-09-20-15h03m45s076.png" width="400">

Because the global M2M economy is projected to have annual revenues of at least $1.5 trillion by 2030, solving these automation problems is of major social importance. 

NFTs provide provable control over any type of digital asset, including the “digital twins” of any object or process in the physical world, including IoT  tracked assets. Because cryptography makes the reliability of blockchains provable, NFT holders can be confident that their ownership of the underlying non-fungible asset is secure. Further, smart contracts enable an NFT seller to place conditions on a token-holder’s rights such as in supply chain as our demo provides. 

Not only that it can be expanded to almost any industry available as almost every single one of them makes use of a warehouse and has to track parts and shipments to be made, and all of that can be tokenized.

Warehousing is a very large expense for a manufacturing company, and inaccurate inventory can have a big impact on profitability. Conventional databases are well-known for user-entry errors, but inventory recorded as a blockchain entry can only exist in one place, and its digital identity moves with the physical item. Databases frequently have a single point of failure—like reliance on one vendor or one cloud provider—and a single unexpected event can cause a cascade of supply chain disruptions.

## At a glance

This is the landing page of our NFT "marketplace", imagine it as a platform such as SAP where you would manage your fleet of offline assets, tracking, sensor data and so forth.

<img src="https://i.ibb.co/wNCHHJ8/image.png">

In the device section after going through Metamask you'll get a look at your fleet of devices, from which you can choose to assigned to an NFTized asset to track it along a certain path that can be predetermined through a smart contract (in which the release can also be automated).

<img src="https://i.ibb.co/zNSk8QD/image.png">

Here you can see how an NFTized asset looks at a glance in the webpage, you can also see the IoT data feed, the Solana link where that data is uploaded to and also the Polygon scan of said NFT with its information and metadata.

<img src="https://i.ibb.co/3d0DHh0/image.png">

For more on the MVP you can check our main video to further our insight on the development of this project and to see IoT devices in real time action!

## How it's built

Each of the IoT devices are connected to the Helium Network. They send the information through LoRaWAN to the network, once it gets there it is sent directly to our integration (an API) which works as a WebHook, this request reaches our IBM Cloud function.  It then  processes each of the hook calls and sends them to the solana blockchain through the Solana CLI, which is installed and configured on the server to communicate with the devnet directly.

System's Architecture:

<img src="https://i.ibb.co/y8Pvpt3/Kharon-drawio-1.png">

All communication with the server and the website is done through API Management to facilitate scalability when server requests become larger.

Services used:

- IBM Bluemix:
  - Helium - Cloud Function - Solana:
    - Push Data to Solana.
      - https://github.com/Blankit-Dev/Project-Kharon/tree/main/CloudFunctions/AddToSolana
  - Cloud Functions - Cloudant:
    - Add Device to DB.
      - https://github.com/Blankit-Dev/Project-Kharon/tree/main/CloudFunctions/Cloudant/AddDeviceToDB
    - Add Product to DB.
      - https://github.com/Blankit-Dev/Project-Kharon/tree/main/CloudFunctions/Cloudant/AddProductToDB
    - Get All Products.
      - https://github.com/Blankit-Dev/Project-Kharon/tree/main/CloudFunctions/Cloudant/GetAllProducts
    - Get Products by Public Key.
      - https://github.com/Blankit-Dev/Project-Kharon/tree/main/CloudFunctions/Cloudant/GetDevicesFromDB
    - Get Devices by Public Key.
      - https://github.com/Blankit-Dev/Project-Kharon/tree/main/CloudFunctions/Cloudant/GetProductsByPubKey

- NFT Storage - NFT IPFS Storage.
  - https://nft.storage/
   
- Helium Network - LoraWAN Main Service.
  - https://www.helium.com/

- Solana JS SDK - Interaction with Solana to catch IoT datafeeds and record them in the blockchain.
  - https://solana-labs.github.io/solana-web3.js

- Polygon - To mint NFTs via smart contracts and the main backend and have EVM compatibility.
   - https://polygon.technology/
   - NFT Contract here: 
     - https://github.com/EddOliver/Kharon/tree/main/Contract

- Alchemy - All smart contract information such as metadata and some variables are managed through Alchemy.
  - https://www.alchemy.com/layer2/polygon

## Market analysis

According to Cisco, over the next decade, the logistics industry, with the implementation of IoT, is likely to generate USD 1.9 trillion, as a result of unlocking higher levels of operational efficiency. This is considering the fact that IoT connects millions of shipments in real time. With its strong manufacturing and transportation and logistics base, North America offers significant potential to asset management technology providers. Furthermore, the governments in the region contributed to increasing the need for asset management in the region. For instance, in the US transportation and logistics sector, the Federal Highway Association (FHWA), along with the American Association of State Highway and Transportation Officials (AASHTO) and state and local departments of transportation (DOTs), has been encouraging the application of asset management.

Overall, technologies, such as RFID, sensors, location-based technologies, and integrating software, and the recent IoT implementation have been serving the needs of asset management. Factors, such as e-commerce and the increasing industrial assets due to Industry 4.0, have been promoting the asset management market.

Asset Tracking Market was valued at USD 17.14 billion in 2020 and is expected to reach USD 34.82 billion by 2026 at a CAGR of 13.45% during the forecast period 2021 - 2026.

<img src="https://i.ibb.co/BqjpS4V/global-asset-tracking.png">

Reference: https://www.prnewswire.com/news-releases/34-82-billion-asset-tracking-markets---global-growth-trends-covid-19-impact-and-forecasts-report-2021-2026--301320916.html

Now let's analyze the growth of the web3 decentralized model for hardware based infrastructure in (you guessed it!) the Helium Network.
Helium Network is the fastest-growing wireless network, decentralising connectivity and expanding access to the internet worldwide. Fewer than two years since the Network's launch, it has achieved global adoption with more than 330,000 Hotspots deployed across 20,000 cities worldwide. Giving an incentive in the form of tokens to those that sustain the network.

<img src="https://i.ibb.co/yVyhPKP/helium.png">

## What's next for Kharon

The project is still in its early stages, we perhaps went a little bit too far with the number of blockchain that we are employing, but every single one is doing in this project what it does best. Solana for cheap and fast transactions for the Helium IoT data feed, Polygon for lowering the cost of minting NFTs, Filecoin/IPFS for NFT and data storage and retrieval and Chainlink supporting  Verifiable Randomness for those NFTs. We know that the it has quite a lot of points of failure because of this and we plan to keep on Developing to reduce them. Despite saying that we think we have THE bridge between Solana and Helium, regarding IoT. The impact regarding the Solana ecosystem is huge, as it merges the ideals of a Nasdaq-speed blockchain architecture with the enourmous infrastructure that the Helium Network has with its more that 230,000 Longfi hotspots around the world and solves the woes that IoT normally has without a blockchain implementation. 

Lastly I would like to say that NFTizing is a gamechanger for IoT. Because the global M2M economy is projected to have annual revenues of at least $1.5 trillion by 2030, solving these automation problems is of major social importance. Blockchains using smart contracts give real-time visibility and the opportunity to intervene earlier into operations gone astray. Blockchains also increase resiliency and lower costs because smart contracts are structured, auditable documents that can take the place of expensive trusted intermediators and enforcement costs.

As the Metaverse progresses we will start NFTizing EVERYTHING and this project is a good starting point in our opinion.

Hopefully you like it!


# Team

#### 3 Engineers with experience developing IoT and hardware solutions. We have been working together now for 5 years since University.

[<img src="https://img.shields.io/badge/Luis%20Eduardo-Arevalo%20Oliver-blue">](https://www.linkedin.com/in/luis-eduardo-arevalo-oliver-989703122/)

[<img src="https://img.shields.io/badge/Victor%20Alonso-Altamirano%20Izquierdo-lightgrey">](https://www.linkedin.com/in/alejandro-s%C3%A1nchez-guti%C3%A9rrez-11105a157/)

[<img src="https://img.shields.io/badge/Alejandro-Sanchez%20Gutierrez-red">](https://www.linkedin.com/in/victor-alonso-altamirano-izquierdo-311437137/)

And yes, we also support the Helium Network!

<img src="https://i.ibb.co/BV1rpJf/nebra.jpg" width="200">

From a long time ago!

Helium IoT for Good contest Runner-up Agrohelium by Luis Eduardo Oliver:

https://www.hackster.io/Edoliver/agrohelium-urban-agriculture-aiot-solution-d8fbf4

Our team comes from a diverse background but we now have around 15 years of combined IoT development experience and are exploring the IoT plus blockchain space.


# Acknowledgements and References

https://www.trendmicro.com/vinfo/mx/security/news/internet-of-things/blockchain-the-missing-link-between-security-and-the-iot

https://www.frontiersin.org/articles/10.3389/fbloc.2020.522600/full

https://www.vechain.org/whitepaper/#bit_dgkec

https://harborresearch.com/more-than-a-meme-nfts-and-the-iot/

https://www.3plcentral.com/2022-state-of-the-third-party-logistics-industry-report

https://www.weforum.org/agenda/2022/01/challenges-supply-chains-covid19-2022
