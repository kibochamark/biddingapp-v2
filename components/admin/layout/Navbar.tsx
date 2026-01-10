import { LayoutDashboard } from 'lucide-react'
import MobileSidebar,{ Permission } from './MobileSidebar'

const Navbar = ({ permissions }: { permissions: Permission }) => {
  return (
      <div className="lg:hidden sticky top-0 z-30 flex items-center gap-3 h-16 px-4 border-b border-border bg-card/95 backdrop-blur-sm">
        
          <div className="w-8 h-8 bg-linear-to-br from-primary to-orange-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="h-5 w-5 text-white" />
          </div>
          <div>
              <h1 className="text-base font-bold text-foreground">BidMarket</h1>
          </div>


          <div className='right-0 ml-auto'>
            <MobileSidebar permissions={permissions}/>
          </div>

          
      </div>
  )
}

export default Navbar