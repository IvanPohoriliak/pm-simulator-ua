function ProjectBriefScreen({ data, onBegin }) {
  return (
    <div className="brief-screen">
      <div className="brief-header">
        <h1 className="brief-title">{data.name}</h1>
        <p className="brief-tagline">{data.tagline}</p>
      </div>

      <div className="brief-section">
        <h3>Project Context</h3>
        <p><strong>Type:</strong> {data.type}</p>
        <p><strong>Situation:</strong> {data.context}</p>
        <p><strong>Deadline:</strong> {data.deadline}</p>
        <p><strong>Budget:</strong> {data.budget}</p>
      </div>

      <div className="brief-section">
        <h3>Client</h3>
        <p><strong>{data.client.name}</strong> - {data.client.role}</p>
        <p>{data.client.description}</p>
      </div>

      <div className="brief-section">
        <h3>Your Team</h3>
        <div className="team-grid">
          {data.team.map((member, index) => (
            <div key={index} className="team-card">
              <h4>{member.name}</h4>
              <p className="team-role">{member.role}</p>
              <p className="team-personality">
                {member.experience} experience • {member.personality}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="warning-box">
        ⚠️ {data.risk}
      </div>

      <div className="btn-center">
        <button className="btn-primary" onClick={onBegin}>
          Begin Week 1
        </button>
      </div>
    </div>
  )
}

export default ProjectBriefScreen
