export default function Profile ({toggleSection, showSections, handleNavigate}) {


  
  return (
    
    <div className='nav-item-with-dropdown'>
    <div className='nav-item profile-item' onClick={() => toggleSection('profile')}>PROFILE
      {showSections.profile ? '▲' : '▼'}
    </div>
    {showSections.profile && (
      <>
        <div className='subitem' onClick={() => handleNavigate('/profile/myaccount')}>My account</div>
        <div className='subitem'>Logout</div>
      </>
    )}
  </div>
  )
}