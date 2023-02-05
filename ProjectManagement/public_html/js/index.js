/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var projDB = "PROJ-DB";
var projREL = "PROJ-REL";
var connToken = "90932716|-31949276702715886|90954549";

function getprojIdAsJsonObj()
{
    var projId = document.getElementById("projId");
    var a = projId.value;
    var jsonStr = {
        id: a
    };
    return JSON.stringify(jsonStr);
}

function saveRecNo2LS(jsonObj)
{
    var data = JSON.parse(jsonObj.data);
    localStorage.setItem("recno",data.rec_no);
}

function fillData(jsonObj)
{
    saveRecNo2LS(jsonObj);
    var data = JSON.parse(jsonObj.data).record;
    document.getElementById("name").value = data.name;
    document.getElementById("assignedTo").value = data.assignedTo;
    document.getElementById("assignedDate").value = data.assignedDate;
    document.getElementById("deadline").value = data.deadline;
}

function getEmp()
{
    var projIdJsonObj = getprojIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, projDB, projREL, projIdJsonObj);
    jQuery.ajaxSetup({async:false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async:true});

    if(resJsonObj.status === 400)
    {
        $('save').prop("disabled",false);
        $('reset').prop("disabled",false);
        $('#name').focus();
    }
    else if(resJsonObj.status === 200)
    {
        $('#projId').prop("disabled", true);
        fillData(resJsonObj);
        document.getElementById("save").disabled = true;
        $('#change').prop("disabled", false);
        $('#reset').prop("disabled", false);
        $('#name').focus();
    }
}

function validateData()
{
    var id, name, assignedTo, deadline, assignedDate;

    id = document.getElementById("projId").value;
    name = document.getElementById("name").value;
    assignedTo = document.getElementById("assignedTo").value;
    deadline = document.getElementById("deadline").value;
    assignedDate = document.getElementById("assignedDate").value;

    if (id === '')
    {
        alert('Project ID missing!');
        $('#projId').focus();
        return "";
    }
    if (name === '')
    {
        alert('Project name missing!');
        $('#name').focus();
        return "";
    }
    if (assignedTo === '')
    {
        alert('Project assignedTo missing!');
        $('#assignedTo').focus();
        return "";
    }
    if (deadline === '')
    {
        alert('Project deadline missing!');
        $('#deadline').focus();
        return "";
    }
    if (assignedDate === '')
    {
        alert('Project assignedDate missing!');
        $('#assignedDate').focus();
        return "";
    }

    var jsonStrObj = {
        id: id,
        name: name,
        assignedTo: assignedTo,
        assignedDate: assignedDate,
        deadline: deadline
    };

    return JSON.stringify(jsonStrObj);
}

function saveData()
{
    var jsonStrObj = validateData();
    if (jsonStrObj === '')
        return "";

    var putRequest = createPUTRequest(connToken, jsonStrObj, projDB, projREL);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    alert("Data saved to database");
    resetData();
    $('#projId').focus();
}

function changeData()
{
    document.getElementById("projId").disabled = true;
    document.getElementById("save").disabled = true;
    jsonStrObj = validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonStrObj, projDB, projREL, localStorage.getItem('recno'));
    jQuery.ajaxSetup({async: false});
    var jsonResObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    alert("Data updated");
    $('#projId').focus();
    resetData();
}

function resetData()
{
    $('#projId').val("");
    $('#name').val("");
    $('#assignedTo').val("");
    $('#assignedDate').val("");
    $('#deadline').val("");

    $('#projId').prop("disabled", false);
    $('#save').prop("disabled", false);
    $('#change').prop("disabled", false);
    $('#reset').prop("disabled", false);

    $('#projId').focus();
}

function removeData()
{
    var reqId = getprojIdAsJsonObj();
    var removeRequest = createREMOVERecordRequest(connToken, projDB, projREL, reqId);
    jQuery.ajaxSetup({async: false});
    var jsonResObj = executeCommandAtGivenBaseUrl(removeRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    alert("Record Removed");
    $('#projId').focus();
    resetData();
}