(function () {
    "use strict";

    angular.module("Election.App", [
        "Election.Component"
    ]);

})();

//Election Component
(function () {
    "use strict";

    angular.module("Election.Component", [
            "Election.Candidate.Component",
            "Election.Results.Component",
            "Election.Vote.Component"
        ])
        .component("tfElection", {
            templateUrl: "App/Election.Component.Template.html",
            controller: ElectionController,
            bindings: { }
        });

		ElectionController.$inject = [ "$timeout" ];

		function ElectionController($timeout){
      console.log('IN Election controller');
			var ctrl = this;

			ctrl.candidates = [];


			ctrl.onCandidateCreate = function(candidate) {
        console.log('in candidate create');
				ctrl.candidates.push(candidate);
			};

			ctrl.onCandidateDelete = function(candidate) {
				var index = ctrl.candidates.indexOf(candidate);
				ctrl.candidates.splice(index, 1);
			};

			ctrl.onVote = function(candidate) {
        console.log('candidate->', candidate);
				var index = ctrl.candidates.indexOf(candidate);
				ctrl.candidates[index].votes += 1;
        ctrl.candidates.sort(function(a,b){
          return parseFloat(b.votes) - parseFloat(a.votes)
        });//end sort function
			};

			ctrl.$onInit = function() {

				// Example Initial Data Request
				// Mimic 1 seconds ajax call
				$timeout(function(){
					ctrl.candidates = [
						{ name: "Puppies", color: "blue", votes: 65 },
						{ name: "Kittens", color: "red", votes: 62 },
						{ name: "Pandas", color: "green", votes: 5 }
					];
				}, 1000);

			};
		}

})();

//Candidate Component
(function (angular) {
    "use strict";

    angular.module("Election.Candidate.Component", [])
        .component("tfElectionCandidate", {
            templateUrl: "App/Election.Candidate.Component.Template.html",
            controller: CandidateController,
            bindings: {
                onCreate: "&",
                onDelete: "&",
                candidates: "<"
            }
        });

		CandidateController.$inject = [];

		function CandidateController(){
      console.log('IN Candidate controller');
			var ctrl = this,
                buildNewCandidate = function() {
                    return {
                        votes: 0,
                        name: "",
                        color: getRandomColor()
                    };
                };

            ctrl.newCandidate = null;

            //TODO Add code to add a new candidate
            ctrl.addNewCandidate = function () {
              console.log("in add new candidate");
              console.log("new candidate name ->" ,ctrl.newCandidate);
              ctrl.onCreate({$candidate: ctrl.newCandidate});
            };//end add new candidate

            //TODO Add code to remove a candidate
            ctrl.removeCandidate = function (candidate) {
              console.log('in remove candidate');
              ctrl.onDelete({$candidate: candidate})
            };//end remove candidate

            // $onInit is called once at component initialization
            ctrl.$onInit = function () {
                ctrl.newCandidate = buildNewCandidate();
            };

            function getRandomColor() {
                var letters = '0123456789ABCDEF';
                var color = '#';
                for (var i = 0; i < 6; i++ ) {
                  color += letters[Math.floor(Math.random() * 16)];
                }
                return color;
              }
		}

})(window.angular);

//Restult Component
(function () {
    "use strict";

    angular.module("Election.Results.Component", [])
        .component("tfElectionResults", {
            templateUrl: "App/Election.Results.Component.Template.html",
            controller: ResultsController,
            bindings: {
                candidates: "<"
            }
        });

		ResultsController.$inject = [];

		function ResultsController(){
			var ctrl = this;

            ctrl.getCandidatePercentage = function (votes) {
                var total = _.sumBy(ctrl.candidates, "votes");
                if (total) {
                    return (100 * votes / total).toFixed(0) + "%"
                }
                return 0 + "%";
            };
		}

})();

//Vote Component
(function () {
    "use strict";

    angular.module("Election.Vote.Component", [])
        .component("tfElectionVote", {
            templateUrl: "App/Election.Vote.Component.Template.html",
            controller: VoteController,
            bindings: {
                candidates: "<",
                onVote: "&"
            }
        });

		VoteController.$inject = [];

		function VoteController(){
      var ctrl = this;

            ctrl.castVote = function (candidate) {
                ctrl.onVote({ $candidate: candidate });
              };
		}

})();
