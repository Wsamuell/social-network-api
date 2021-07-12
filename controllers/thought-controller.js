const { User, Thought, Reaction } = require('../models');

const thoughtController = {
    getAllThought(req, res) {
        Thought.find({})
            .populate([
                { path: 'reactions', select: '-__v' },
            ])
            .select('-__v')
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
            .populate([
                { path: 'reactions', select: '-__v' },
            ])
            .select('-__v')
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found with this ID.' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    createThought({ body }, res) {
        Thought.create(body)
            .then(dbThoughtData => {
                User.findByIdAndUpdate({ _id: body.userId }, { $pull: { thoughts: dbThoughtData._id } }, { new: true })
                    .then(dbUserData => {
                        if (!dbUserData) {
                            res.status(404).json({ message: 'No User found with this ID' });
                            return;
                        }
                        res.json(dbUserData);
                    })
                    .catch(err => res.status(400).json(err));
            })
            .catch(err => res.status(400).json(err));

    },
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true })
            .select('-__v')
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found with this ID' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.status(400).json(err));
    },
    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
            .then(dbThoughtData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No thought found with this ID' });
                    return;
                }
                User.findOneAndUpdate(
                    { username: dbThoughtData.username },
                    { $pull: { thoughts: params.id } }
                )
                    .then(() => {
                        res.json({ message: 'Successfully deleted the thought' });
                    })
                    .catch(err => res.status(500).json(err));
            })
            .catch(err => res.status(400).json(err));
    },
    addReaction({ params, body}, res) {
        Thought.findByIdAndUpdate({ _id: params.thoughtId }, { $addToSet: { reactions: body } }, { new: true })
        .then(dbThoughtData => {
            if(!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with that ID!' });
                return;
            }
            res.json(dbThoughtData)
        })
        .catch(err => res.status(400).json(err));
    },
    deleteReaction({ params, body }, res) {
        Thought.findByIdAndUpdate({ _id: params.thoughtId }, { $pull: { reactions: { reactionId: body.reactionId } } }, { new: true })
        .then(dbThoughtData => {
            if(!dbThoughtData) {
                res.status(404).json({ message: 'No reaction found with this Id!' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(400).json(err));
    }

};


module.exports = thoughtController;