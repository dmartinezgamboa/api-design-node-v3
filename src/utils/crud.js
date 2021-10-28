export const getOne = model => async (req, res) => {
  try {
    const id = req.params.id
    const userId = req.user._id
    const doc = await model.findOne({ _id: id, createdBy: userId }).exec()
    if (!doc) {
      return res.status(400).end()
    }
    return res.status(200).json({ data: doc })
  } catch (e) {
    console.error(e)
  }
}

export const getMany = model => async (req, res) => {
  const userId = req.user._id
  const doc = await model.find({ createdBy: userId }).exec()
  return res.status(200).json({ data: doc })
}

export const createOne = model => async (req, res) => {
  try {
    const userId = req.user._id
    const doc = await model.create({ ...req.body, createdBy: userId })
    return res.status(201).json({ data: doc })
  } catch (e) {
    console.error(e)
  }
}

export const updateOne = model => async (req, res) => {
  try {
    const id = req.params.id
    const userId = req.user._id
    const doc = await model
      .findOneAndUpdate({ _id: id, createdBy: userId }, req.body, { new: true })
      .exec()
    if (!doc) {
      return res.status(400).end()
    }
    return res.status(200).json({ data: doc })
  } catch (e) {
    console.error(e)
  }
}

export const removeOne = model => async (req, res) => {
  try {
    const id = req.params.id
    const userId = req.user._id
    const doc = await model.findOneAndRemove({ _id: id, createdBy: userId })
    if (!doc) {
      return res.status(400).end()
    }
    return res.status(200).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const crudControllers = model => ({
  removeOne: removeOne(model),
  updateOne: updateOne(model),
  getMany: getMany(model),
  getOne: getOne(model),
  createOne: createOne(model)
})
