var ps = playerService();//gives you the playerService Obj
var ts = teamService();//gives you the teamService Obj
// GET JSON from CBS Sports Football API
function teamService() {
    var _teams = [];

    return {
        loadTeams: function (cb) {
            var url = "http://bcw-getter.herokuapp.com/?url=";
            var url2 = 'http://api.cbssports.com/fantasy/pro-teams?version=3.0&SPORT=football&response_format=json';
            var apiUrl = url + encodeURIComponent(url2);
            $.getJSON(apiUrl, function (response) {
                _teams = response.body.pro_teams;
                cb();
            })
        },
        getTeams: function () {
            return _teams;
        }
    }
}

function playerService() {

    var _players = [];
    var _activeTeam = []; //whole object

    return {
        loadPlayers: function (playerController) {
            var url = "http://bcw-getter.herokuapp.com/?url=";
            var url2 = "http://api.cbssports.com/fantasy/players/list?version=3.0&SPORT=football&response_format=json";
            var apiUrl = url + encodeURIComponent(url2);
            $.getJSON(apiUrl, function (response) {
                _players = response.body.players;
                ts.loadTeams(playerController)
            })
        },
        getPlayers: function () {
            return _players.slice();
        },
        getPlayersById: function(id){
            for (var i = 0; i < _activeTeam.length; i++) {
                if (_activeTeam[i].id === id) {
                    return _activeTeam[i];
                }
            }

        },
        getPlayersByTeam: function (team) {
            var requestedTeam = _players.filter(function (player) {
                if (player.pro_team === team) {
                    console.log(player);
                    return true;
                }
            })
            _activeTeam = requestedTeam;
            return requestedTeam;
        }
      
    }
}

$(document).ajaxStart(function()
{                               //start spinner
    $('#loader').show();
})
$(document).ajaxStop(function()
{
    $('#loader').hide();
})

ps.loadPlayers(playerController);

function playerController() {

    var teams = ts.getTeams();

    for (var i = 0; i < teams.length; i++) {
        var team = teams[i];
        $('#selectTeam').append('<option value="' + team.abbr + '">' + team.name + ' ' + team.nickname + '</option>');
    }

    //var sfPlayerObject = ps.getPlayersByTeam('SF'); //this returns an array of players

    $('#selectTeam').on('change', function () {
        var selectedTeam = $(this).val();
        var requestedTeam = ps.getPlayersByTeam(selectedTeam); //passes in select team value to the getPlayersByTeam function that returns that player object from the array
        addPlayersToPlayerSelect(requestedTeam)
    })

    function addPlayersToPlayerSelect(team) {
        var nameSelect = $('#selectName');
        nameSelect.html('<option>none</none>');//clears list of names
        for (var i = 0; i < team.length; i++) {
            var player = team[i];
            nameSelect.append('<option value="' + player.id + '">' + player.fullname) + '</option>';
        }
    }

    $('#selectName').on('change', function (){

        var playerID = $(this).val();
        var player = ps.getPlayersById(playerID); // player gets set to the returned value of the function that we set it equal to ps.getPlayersByID

        console.log(player);

        //lets update the add player form with the current player information

        $('#nameInput').val(player.fullname);
        $('#positionInput').val(player.position);
        $('#numberInput').val(player.jersey);
        $('#playerImageUrl').val(player.photo);
        $('#playerImage').attr('src', player.photo);
        $('#playerImage').removeClass('hidden');


    })
};

$(function () {
    $("#progressbar").progressbar({
        value: 0
    });
});




   //for (var i = 0; i < sfPlayerObject.length; i++) {
   //    var player = sfPlayerObject[i];
   //    var html = '<div class="player-card">' +
   //             '<div id="player-card-image">' +
   //             '<img src = "'+ player.photo+'"/>' +
   //             '<p>Player Name:' + player.fullname + '</p>' +
   //             '<p> Player Position:' + player.pro_team + '</p>' +
   //             '<p>Player Number:' + player.position + '</p>' +
   //             '<button class = "btn btn-info remove-player">Remove Player</button></div>'
   //    $('.player-roster').append(html);
   //}


   //$("#selectTeam").append('<option id="team" value="Select Pro-team">'+pt+'</option>');
   
   //ps.loadPlayersByName();

$('#buttonAdd').click(addPlayer);
var progressTotal = 0;
var maxPlayers = 20;
var progressStep = 5;
var progressTotal = (1 / maxPlayers * 100);
function addPlayer() //addPlayer function
{
    var nameToAdd = $('#nameInput').val();
    var positionToAdd = $('#positionInput').val();
    var numberToAdd = $('#numberInput').val();
    var pic = $('#playerImageUrl').val()
    if (!pic) {
        pic = 'http://s.nflcdn.com/static/content/public/image/fantasy/transparent/200x200/'
    } 
    var html = '<div class="player-card" style = "display:inline-block; border:10px solid black">' +
                '<div id="player-card-image">' +
                '<img src = "'+ pic +'"/>' +
                '<p>Player Name:' + nameToAdd + '</p>' +
                '<p> Player Position:' + positionToAdd + '</p>' +
                '<p>Player Number:' + numberToAdd + '</p>' +
                '<button class = "btn btn-info remove-player">Remove Player</button></div>'
                
    $('.player-roster').append(html);
    progressTotal = progressTotal+ progressStep;
    console.log(progressTotal);
    console.log('Progress sum is ' + progressTotal);
    $("#progressbar").progressbar("value", progressTotal);
   
    // var newPlayer = PlayerFactory.createPlayer(nameToAdd, positionToAdd, numberToAdd); //input data is sent to createPlayer method on player factory
    $('.remove-player').on('click', function () {
        $(this).parent().remove();
        //alert('this remove works');

    });
    
}



//function Player(playerName, playerPosition, playerNumber, playerID) //player constructor to call when we want to NEW UP A PLAYER
//{
//    this.playerName = playerName;
//    this.playerPosition = playerPosition;
//    this.playerNumber = playerNumber;
//    this.playerID = playerID;
//}








