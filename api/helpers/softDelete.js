module.exports = schema => {
	schema.add({
		deleted: {
			type: Boolean,
			default: false,
			index: true
		}
	});
	schema.add({ deletedAt: Date });

	schema.methods.softdelete = function (callback) {
		this.deleted = true;
		this.deletedAt = new Date();
		this.save(callback);
	};

	schema.methods.restore = function (callback) {
		this.deleted = false;
		this.deletedAt = null;
		this.save(callback);
	};

	const typesFindQueryMiddleware = [
		'count',
		'find',
		'findOne',
		'findOneAndDelete',
		'findOneAndRemove',
		'findOneAndUpdate',
		'update',
		'updateOne',
		'updateMany'
	];

	schema.pre(typesFindQueryMiddleware, function (next) {
		if (this.getFilter().deleted !== undefined) return next();

		this.setQuery({ ...this.getFilter(), deleted: false });
		return next();
	});

	schema.pre('aggregate', function () {
		const pip = this.pipeline();
		if (pip.length > 0 && pip[0].$match) {
			if (pip[0].$match.deleted === undefined) pip[0].$match.deleted = false;
		} else this.pipeline().unshift({ $match: { deleted: false } });
	});
};
