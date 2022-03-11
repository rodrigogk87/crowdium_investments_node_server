const express = require('express');
const router = express.Router();
const connectionDB = require('./../../db');
const checkAuth = require('../middleware/check-auth');
const ethers = require("ethers");
const { configs } = require("../config");
const CrowdiumInvestment = require("../artifacts/contracts/CrowdiumInvestment.sol/CrowdiumInvestment.json");
const Web3  = require('web3');

const web3 = new Web3();
const provider = new ethers.providers.AlchemyProvider(configs.ALCHEMY_NETWORK,configs.ALCHEMY_KEY);
const signer = (new ethers.Wallet(configs.WALLET_KEY)).connect(provider);
const contract = new ethers.Contract(
    configs.CONTRACT_ADDRESS,
    CrowdiumInvestment.abi,
    signer
  );



/*
    {"investment": "nordelta","individual_amount": 14.445}
*/
//post investment
router.post('/', checkAuth, async (req, res, next) => {

    try {
        let json = JSON.stringify(req.body);

        const tx = await contract.setInvestment(json);

        const investments = await contract.getInvestments();
        let length = investments.length;
        
        const sqlInsert = "INSERT INTO `investment`(`hash`,`index`) VALUES ('" + tx.hash + "','" + length + "')";
        connectionDB.query(sqlInsert, (err, response) => {
            if (err) res.status(500).json(err);
            else res.status(200).json(tx)
        })

      } catch (error) {
        res.status(500).json(error);
      }

})
/*
{
	"data": {"investment": "nordelta2","individual_amount": 14.445},
	"hash":"0xbc9bda060dc9d3fc3e019b0325ccd23149e815ceb68ec9a7e08e29c18dbc9756"
}
*/
router.put('/', checkAuth, async (req, res, next) => {

    try {
        let hash = req.body.hash;
        let json = JSON.stringify(req.body.data);
        //let json = req.body.json;
        
        const sqlGet = "SELECT * from investment WHERE  hash='"+hash+"'";
        console.log(sqlGet);
        connectionDB.query(sqlGet, async (err, response) => {
            if (err) res.status(500).json(err);
            else{
                results=JSON.parse(JSON.stringify(response))
                const tx = await contract.updateInvestment(results[0].index,json);
                 //UPDATE `investment` SET `hash`='[value-1]',`index`='[value-2]' WHERE 1 old hash = parameter
                const sqlInsert = "UPDATE `investment` SET `hash`='"+tx.hash+"' WHERE hash='"+hash+"'";
                connectionDB.query(sqlInsert, (err, response) => {
                    if (err) res.status(500).json(err);
                    else res.status(200).json(tx)
                })
            }
        })
      } catch (error) {
        res.status(500).json(error);
      }

})


/*router.get('/transfer', checkAuth, async (req, res, next) => {
    let tx = await contract.transferOwnership('0x673D740fd0FAE7aEc84bB251724fBfe66952176C')
    res.json(tx)
})*/

/*
    {
        "index": 0,
        "data": {
            "investment": "nordelta",
            "individual_amount": 5.25
        }
    }
*/
//get investment by hash
router.get('/hash/:hash', checkAuth, async (req, res, next) => {
    try{
        const sqlGet = "SELECT * from investment WHERE  hash='"+req.params.hash+"'";
        connectionDB.query(sqlGet, async (err, response) => {
            if (err) res.status(500).json(err);
            else{
                results=JSON.parse(JSON.stringify(response))
                const investmentData = await contract.getInvestmentData(results[0].index);

                let result = {
                        "index": results[0].index, 
                        "data": JSON.parse(investmentData)
                    }

                res.json(result)
            }
        })
    } catch (error) {
        res.status(500).json(error);
    }
})

/*
    [
        {
            "index": 0,
            "data": {
                "investment": "nordelta",
                "individual_amount": 5.25
            }
        },
        {
            "index": 1,
            "data": {
                "investment": "puertos",
                "individual_amount": 15.25
            }
        }
    ]
*/
//get all investments
router.get('/', checkAuth, async (req, res, next) => {
    const investments = await contract.getInvestments();
    let response = [];
    investments.forEach(investment => {
        
        try{
            let index = web3.utils.toBN(investment.index).toNumber();

            let element = {
                "index": index, 
                "data": JSON.parse(investment.data)
            }

            response.push(element);
        }catch(e){
            console.log('error get all investments',e);
        }
    });
    res.json(response)
})


router.get('/info', checkAuth, async (req, res, next) => {
    try{
        const sqlGet = "SELECT count(*) as txCount,MAX(updated_at) as lastTxDate from investment;";
        connectionDB.query(sqlGet, async (err, response) => {
            if (err) res.status(500).json(err);
            else{
                results=JSON.parse(JSON.stringify(response))
                let result = {
                        "txCount": results[0].txCount, 
                        "lastTxDate": results[0].lastTxDate
                    }

                res.json(result)
            }
        })
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router;