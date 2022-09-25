const { MongoClient } = require('mongodb');
const { url } = require('../../config/db');
var ObjectID = require('mongodb').ObjectId;

const client = new MongoClient(url);
const database = client.db('notable');
const notes = database.collection('notes');

module.exports = function(app){
    app.post('/notes/new-note', async (req, res) => {
        const note = {
            title: req.body.title,
            body: req.body.body
        }

        await notes.insertOne(note);
        
        res.send(note);
    });

    app.get('/notes', async (req, res) => {
        const items = await notes.find({}).toArray();
        
        res.send(items);
    });

    app.get('/notes/:id', async (req, res) => {
        const id = req.params.id;

        const itemDetails = {
            '_id': new ObjectID(id)
        };

        const item = await notes.findOne(itemDetails)
        res.send(item);
    });

    app.delete('/notes/:id/delete', async (req, res) => {
        const id = req.params.id;

        const itemDetails = {
            '_id': new ObjectID(id)
        };

        await notes.deleteOne(itemDetails);
        res.send(`The note with the id: ${id} was deleted successfully!`);
    });

    app.delete('/notes/delete-many', async (req, res) => {
        const itemDetails = req.body;

        console.log(itemDetails);

        await notes.deleteMany(itemDetails);
        res.send("Self destruction completed!");
    });

    app.put('/notes/:id/update', async (req, res) => {
        const id = req.params.id;

        const itemDetails = {
            '_id': new ObjectID(id) 
        };

        const oldItem = await notes.findOne(itemDetails);

        const newValues = { $set: {
            title: req.body.title ? req.body.title : oldItem.title, 
            body: req.body.body ? req.body.body : oldItem.body 
        }};

        await notes.updateOne(itemDetails, newValues);

        res.send(`The note with the id: ${id} was updated successfully!`)
    })
};