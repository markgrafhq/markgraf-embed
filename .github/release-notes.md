## v0.1.14

- feat(still): hold stills/titles on screen as a dwell; gate edge labels to present edges
- feat(render): draw edge labels + title cards on stills, gated by keyframe kind
- feat(lang): add still/title beats, edge labels, keyframe rename (model+parser+printer)
- 
- feat(embed): honor data-markgraf-theme so surfaces can match their colour scheme
- 
- fix(deps): pin yoga-stories to published git ref v0.1.14 so CI builds the stories
- 
- perf(player): buffer the re-themed cache outward from the playhead
- perf(player): reuse the camera/spring arrays across theme switches
- perf(player): reuse the schedule on theme switch instead of rebuilding it
- fix(player): stream frames on theme switch instead of re-rendering all up front
- feat(player): cycle palette themes live with the T key
- feat(compaction): drive post-routing spacings from layout options instead of baked-in constants
- feat(release): post the git-log changelog to Discord on publish
