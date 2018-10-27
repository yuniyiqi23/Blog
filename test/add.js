var createNamespace = require('continuation-local-storage').createNamespace;
var session = createNamespace('my session'); 

router.get('/:id', (req, res, next) => {
	session.set('transactionId', 'some unique GUID');
	someService.getById(req.params.id);
	logger.info('Starting now to get something by Id');
})
//Now any other service or components can have access to the contextual, per-request, data
class someService {
	getById(id) {
		logger.info('Starting now to get something by Id');//other logic comes here
	}
}
//Logger can now append transaction-id to each entry, so that entries from the same request will have the same value
class logger {
	info(message) {
		console.log(`message ${session.get('transactionId')}`);
	}
}