
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
var bodyParser = require('body-parser')
const fs = require('fs')

app.use(express.json())
app.use(cors())
app.options('*',cors())
app.use(morgan('tiny'))
app.use(bodyParser.urlencoded({ extended: false })) 
app.use(bodyParser.json())

app.get('/',(req,res) => {
    res.send(`hii welcome to home page`)
})

app.get('/quotes',(req,res) => {
    let Quotes = JSON.parse(fs.readFileSync('quotes.json').toString())
    let allQuotes = Quotes.map((p,i) => {
        return {
            id:p.id,
            quote:p.quote,
            author:p.author
        }
    })
    res.status(200).send(allQuotes)
   
})

app.get('/quotes/:id',(req,res) => {
    let Quotes = JSON.parse(fs.readFileSync('quotes.json').toString()) 
    let single = Quotes.filter((p) => {
        if(p.id == req.params.id){
            return true
        }else{
            return false
        }
    })
    if(single.length === 0){
        res.status(404).send(`no quote found`)
    }else{
        res.status(200).send(single)
    }
})

app.post('/quotes',(req,res) => {
    let Quotes = JSON.parse(fs.readFileSync('quotes.json').toString()) 
    let {quote,author} = req.body
    if(!quote){
        return res.status(404).json({msg:'quote is mandatory'})
    }
    if(!author){
        return res.status(404).json({msg:'author is mandatory'})
    }
    let newQuote = {
        id:Quotes.length+1,
        quote:quote,
        author:author
    }
    Quotes.push(newQuote)
    fs.writeFile('quotes.json',JSON.stringify(Quotes,null,2),function(err){
        if(err){
            res.status(404).send(`quote did not created`)
        }else{
            res.status(201).send(newQuote)
        }
    })
})

app.put('/quotes/:id', (req, res) => {
    let Quotes = JSON.parse(fs.readFileSync('quotes.json').toString());
    let { quote, author } = req.body;
    let idx = Quotes.findIndex((p) => p.id == req.params.id);
    let Quote = Quotes[idx]

    if (idx === -1) {
        return res.status(404).json({ msg: 'Quote not found' });
    }

    if (quote) {
        Quote.quote = quote;
    }
    if (author) {
        Quote.author = author;
    }

    fs.writeFile('quotes.json', JSON.stringify(Quotes, null, 2), function (err) {
        if (err) {
            res.status(500).json({ msg: 'Failed to update quote' });
        } else {
            res.status(200).json(Quote);
        }
    });
});
app.delete('/quotes/:id', (req, res) => {
    let Quotes = JSON.parse(fs.readFileSync('quotes.json').toString());
    let idx = Quotes.findIndex((p) => p.id == req.params.id);

    if (idx === -1) {
        return res.status(404).json({ msg: 'Quote not found' });
    }

    Quotes.splice(idx, 1);

    fs.writeFile('quotes.json', JSON.stringify(Quotes, null, 2), function (err) {
        if (err) {
            res.status(500).json({ msg: 'Failed to delete quote' });
        } else {
            res.status(200).json({ msg: 'Quote deleted successfully',Quotes });
        }
    });
});

const port = 3500

app.listen(port,() => {
    console.log(`server is running on port ${port}`)
})
