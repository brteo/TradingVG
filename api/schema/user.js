module.exports = {
	user: {
		$id: 'user',
		type: 'object',
		properties: {
			email: { type: 'string', format: 'email' },
			password: { type: 'string' },
			account: { type: 'string' },
			name: { type: 'string' },
			lastname: { type: 'string' },
			birthdate: { type: 'string', format: 'date' }
		},
		additionalProperties: false
	}
};
