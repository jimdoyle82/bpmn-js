'use strict';

var Matchers = require('../../../Matchers'),
    TestHelper = require('../../../TestHelper');

/* global bootstrapViewer, inject */


var fs = require('fs');

var contextPadModule = require('../../../../lib/features/context-pad'),
    bpmnModule = require('../../../../lib/core');


describe('features - context-pad', function() {

  beforeEach(Matchers.addDeepEquals);


  var diagramXML = fs.readFileSync('test/fixtures/bpmn/simple.bpmn', 'utf8');

  var testModules = [ contextPadModule, bpmnModule ];

  beforeEach(bootstrapViewer(diagramXML, { modules: testModules }));


  describe('bootstrap', function() {

    it('should bootstrap', inject(function(contextPadProvider) {
      expect(contextPadProvider).toBeDefined();
    }));

  });
});
