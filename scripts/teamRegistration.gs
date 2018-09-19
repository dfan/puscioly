formID = // Put formID here

totalTeamCountLimit = 48
secondTeamCountLimit = 8

function initializeProperties(){
  PropertiesService.getScriptProperties().setProperty('totalTeamCount', 0);
  PropertiesService.getScriptProperties().setProperty('secondTeamCount', 0);
}

function openForm(){
  var form = FormApp.openById(formID);
  form.setAcceptingResponses(true);
}
function closeForm(){
  var form = FormApp.openById(formID);
  form.setAcceptingResponses(false);
}
function onSubmit(e){
  acceptedAll = false;
  acceptedOne = false;

  var itemResponses = e.response.getItemResponses();
  var teamsRegistered = Number(itemResponses[!isNaN(Number(itemResponses[11].getResponse())) ? 11 : 12].getResponse())
  var totalTeamCount = Number(PropertiesService.getScriptProperties().getProperty('totalTeamCount'));
  var secondTeamCount = Number(PropertiesService.getScriptProperties().getProperty('secondTeamCount'));

  if (totalTeamCount < totalTeamCountLimit) {
    if (teamsRegistered == 1) {
      totalTeamCount += 1;
      acceptedAll = true;
    } else if (teamsRegistered == 2) {
      totalTeamCount += 1;
      if (totalTeamCount < totalTeamCountLimit && secondTeamCount < secondTeamCountLimit) {
        totalTeamCount += 1;
        secondTeamCount += 1;
        acceptedAll = true;
      } else {
        acceptedOne = true;
      }
      PropertiesService.getScriptProperties().setProperty('secondTeamCount', secondTeamCount)
    } else {
      Logger.log("teamsRegistered not 1 or 2: " + teamsRegistered);
    }
  }
  PropertiesService.getScriptProperties().setProperty('totalTeamCount', totalTeamCount);
  sendConfirmationEmail(e, acceptedAll, acceptedOne);
}

function sendConfirmationEmail(e, all, one) {
  var itemResponses = e.response.getItemResponses(); 
  var coachFirstName = itemResponses[0].getResponse();
  var coachLastName = itemResponses[1].getResponse();
  var coachEmail = itemResponses[2].getResponse();
  var teamEmail = itemResponses[4].getResponse();
  var schoolName = itemResponses[!isNaN(Number(itemResponses[11].getResponse())) ? 4 : 5].getResponse()
  var teamsRegistered = Number(itemResponses[!isNaN(Number(itemResponses[11].getResponse())) ? 11 : 12].getResponse())
  var pusoEmail = "scioly@princeton.edu"
  
  Logger.log(coachFirstName + "\n" + coachLastName + "\n" + coachEmail + "\n" + schoolName + "\n" + teamsRegistered)
  
  var bodyGreeting = "Hi " +  coachFirstName + " " + coachLastName + ", \n\n"
  var bodyPar1 = (all ? schoolName + " has successfully registered " + teamsRegistered + " team" + (teamsRegistered == 1 ? "" : "s") + " for the Princeton University Science Olympiad Invitational on February 9th, 2019!" : 
                (one ? schoolName + " has successfully registered 1 team for the Princeton University Science Olympiad Invitational on February 9th, 2019! Due to the quick closing of registration and our 8 school cap on schools with two teams, we are unfortunately unable to register your second team at this time. If spots open in the future, we will contact you regarding whether you would like to register your other team as well." :
                "Due to the quick closing of registration, " + schoolName + " has been placed on the waitlist for the Princeton University Science Olympiad Invitational on February 9th, 2019. If space opens up, we will email you to confirm that 1 team will attend the tournament. Please keep this e-mail as your waitlist confirmation, and reply to this email to acknowledge that you would like to keep your position on the waitlist."
                )) + "\n\n"
  var bodyPar2 = all || one ? "Please keep this e-mail as your registration confirmation. Should you choose to withdraw your team from our tournament after 11:59 PM EST, November 23, 2018, your school will incur a $100 fee per team withdrawn. Please reply to this email to acknowledge that you have received this email, understand the terms of your registration, and intend to participate in the tournament. Your response will confirm your school’s allotted slot in the 2019 Princeton University Science Olympiad Invitational.\n\n":
                 ""
  var bodyPar3 = all || one ? "We are excited to welcome you to Princeton and look forward to seeing you at our tournament! If you have any questions, please contact us at scioly@princeton.edu. Required waiver forms and team rosters will be sent out in a few months. \n\n" :
                 "We hope to welcome you to Princeton! If you have any questions, please contact us at scioly@princeton.edu."
  var signature = "Sincerely, \n\nJune Ho Park and Linus Wang \nCo-Directors"
  var bodyContent = bodyGreeting + bodyPar1 + bodyPar2 + bodyPar3 + signature
  
  var SENDGRID_KEY = // Put SendGrid API key here

  var headers = {
    "Authorization" : "Bearer " + SENDGRID_KEY, 
    "Content-Type": "application/json" 
  }

  var body = {
    "personalizations": [
      {
        "to": [
          {
            "email": coachEmail
          }
        ],
        "bcc" : [
          {
            "email": pusoEmail
          }
        ],
        "subject": "Thank You for Registering for the 2019 Princeton University Science Olympiad Invitational!"
      }
    ],
    
    "from": {
      "name": "Princeton University Science Olympiad",
      "email": "scioly@princeton.edu"
    },
    
    "content": [
      {
        "type": "text",
        "value": bodyContent
      }
    ]
  }

  if (teamEmail.length != 0) {
    body["personalizations"]["cc"] = teamEmail
  }

  var options = {
    'method':'POST',
    'headers':headers,
    'payload':JSON.stringify(body)
  }


 var response = UrlFetchApp.fetch("https://api.sendgrid.com/v3/mail/send",options);

 Logger.log(response); 
}
