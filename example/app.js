(function() {

  var Viewer = require('bpmn/Viewer'),
      Modeler = require('bpmn/Modeler'),
      Model = require('bpmn/Model');

  var container = $('#js-drop-zone');

  var canvas = $('#js-canvas');

  var BpmnJS = canvas.is('.modeler') ? Modeler : Viewer;
  
  var renderer = new BpmnJS(canvas.get(0));

  var newDiagramXML =
'<?xml version="1.0" encoding="UTF-8"?>' +
'<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn">' +
'  <bpmn2:process id="Process_1" isExecutable="false">' +
'    <bpmn2:startEvent id="StartEvent_1"/>' +
'  </bpmn2:process>' +
'  <bpmndi:BPMNDiagram id="BPMNDiagram_1">' +
'    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">' +
'      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">' +
'        <dc:Bounds height="36.0" width="36.0" x="412.0" y="240.0"/>' +
'      </bpmndi:BPMNShape>' +
'    </bpmndi:BPMNPlane>' +
'  </bpmndi:BPMNDiagram>' +
'</bpmn2:definitions>';

  function createNewDiagram() {
    openDiagram(newDiagramXML);
  }

  function openDiagram(xml) {

    renderer.importXML(xml, function(err) {
      
      if (err) {
        container
          .removeClass('with-diagram')
          .addClass('with-error');

        container.find('.error pre').text(err.message);

        console.warn('[import] ' + err.message);
      } else {
        container
          .removeClass('with-error')
          .addClass('with-diagram');
      }
    });
  }

  function saveDiagram(done) {

    var definitions = renderer.definitions;

    if (definitions) {
      Model.toXML(definitions, { format: true }, function(err, xml) {
        done(err, xml);
      });
    }
  }

  ////// file drag / drop ///////////////////////

  // check file api availability
  if (!window.FileList || !window.FileReader) {
    window.alert('Looks like you use an older browser that does not support drag and drop. Try using Chrome, Firefox or the Internet Explorer > 10.');
    return;
  }

  (function onFileDrop(container, callback) {

    function handleFileSelect(e) {
      e.stopPropagation();
      e.preventDefault();

      var files = e.dataTransfer.files;

      var file = files[0];
        
      var reader = new FileReader();

      reader.onload = function(e) {

        var xml = e.target.result;

        callback(xml);
      };

      reader.readAsText(file);
    }

    function handleDragOver(e) {
      e.stopPropagation();
      e.preventDefault();

      e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    }

    container.get(0).addEventListener('dragover', handleDragOver, false);
    container.get(0).addEventListener('drop', handleFileSelect, false);

  })(container, openDiagram);


  $(document).on('ready', function() {

    $('#js-create-diagram').click(function(e) {
      e.stopPropagation();
      e.preventDefault();

      createNewDiagram();
    });

    var downloadLink = $('#js-download-diagram');

    setInterval(function() {
      saveDiagram(function(err, xml) {

        if (!xml || err) {
          return;
        }

        var encoded = encodeURIComponent(xml);

        downloadLink.attr({
          'href': 'data:application/bpmn20-xml;charset=UTF-8,' + encoded,
          'download': 'diagram.bpmn'
        });
      });

    }, 5000);
  });

})();