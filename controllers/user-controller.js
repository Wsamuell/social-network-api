const { User, Thought } = require('../models');

const userController = {
    getAllUsers(req, res) {
        User.find({})
            .select('-__v')
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .populate({
                path: 'friends',
                select: '-__v'
            })
            .select('-__v')
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No User found with this ID' });
                    return;
                }
                res.json({dbUserData: dbUserData, statusMessage:'Here is your User!'});

            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    createUser({ body }, res) {
        User.create(body)
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.status(400).json(err));
    },
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true })
            .select('-__v')
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No User found with this ID' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
    },
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })

            .then(dbUserData => {
                console.log(dbUserData)
                if (!dbUserData) {
                    res.status(404).json({ message: 'No User found with this ID' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
    },

    addFriend({ params }, res) {
        User.findByIdAndUpdate({ _id: params.userId }, { $addToSet: { friends: params.friendId } }, { new: true })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No User with that ID' });
                    return;
                }
                User.findByIdAndUpdate({ _id: params.friendId }, { $addToSet: { friends: params.userId } }, { new: true })
                    .then(dbSecondUserReturn => {
                        if (!dbSecondUserReturn) {
                            res.status(404).json({ message: 'No User with that ID' });
                            return;
                        }
                        res.json(dbUserData);

                    })
                    .catch(err => res.status(400).json(err));
            })
            .catch(err => res.status(400).json(err));

    },

    deleteFriend({ params }, res) {
        User.findOneAndUpdate({ _id: params.userId }, { $pull: { friends: params.friendId } }, { new: true })
            .select('-__v')
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No User found with this ID' });
                    return;
                }
                User.findOneAndUpdate({ _id: params.friendId }, { $pull: { friends: params.userId } }, { new: true })
                    .then(dbSecondUserReturn => {
                        if (!dbSecondUserReturn) {
                            res.status(404).json({ message: 'No User found with this ID' });
                            return;
                        }
                        res.json({ message: 'Friend has now been deleted' });
                    })
                    .catch(err => res.status(400).json(err));
            })
            .catch(err => res.status(400).json(err));
    },
};


module.exports = userController;