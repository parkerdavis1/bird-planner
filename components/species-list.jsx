import ObservationList from "../components/observation-list";
import Timeago from "../components/timeago";
import images from "../images.json";
import Button from "./button";

export default function SpeciesList({items, onSeen, onToggle, lat, lng}) {
	return (
		<div>
			{items?.map(({name, sciName, code, reports, isExpanded}) => {
				const date = reports[0].obsDt;
				const distances = reports.map(({distance}) => distance);
				const shortestDistance = distances.sort((a, b) => (a - b)).shift();
				const distancesAllEqual = distances.every(value => value === distances[0]);
				const imageUrl = images[sciName] || "/bird.svg";
				reports = reports.map(report => ({...report, isClosest: !distancesAllEqual && shortestDistance === report.distance}));
				return (
					<article key={code} className="mb-4 border border-gray-200 bg-white shadow-sm rounded-md w-full">
						<div className="flex">
							<div className="flex-shrink-0">
								<img src={imageUrl} width="150" height="150" className={`object-cover rounded p-4 w-[150px] h-[150px] ${!images[sciName] ? "opacity-50" : ""}`}/>
							</div>
							<div className="pr-4 pt-6 w-full">
								<header className="flex justify-between">
									<h3 className="font-bold text-lg mb-4">{name}</h3>
									<div>
										<Timeago datetime={date} className="bg-gray-300 rounded-sm ml-4 px-2 py-1 text-xs whitespace-nowrap"/>
										<span dateTime={date} className="bg-gray-300 rounded-sm ml-4 px-2 py-1 text-xs whitespace-nowrap">{shortestDistance} mi</span>
									</div>
								</header>
								<hr className="mb-4"/>
								<div className="flex gap-2">
									<Button size="sm" onClick={() => onToggle(code)}>{isExpanded ? "Hide" : "Show"} {reports.length} {reports.length === 1 ? "Report" : "Reports"}</Button>
									<Button size="sm" onClick={() => onSeen(code)}>Seen</Button>
								</div>
							</div>
						</div>
						{isExpanded && <ul className="pl-4 pr-4 pb-4 flex flex-col gap-4">
							<ObservationList items={reports} userLat={lat} userLng={lng}/>
						</ul>}
					</article>
				)
			})}
		</div>
	)
}