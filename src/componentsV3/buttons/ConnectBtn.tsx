
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { FaSignOutAlt, FaUserCircle, FaWallet } from 'react-icons/fa';

export const CConnectBtn = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        chainModalOpen,
        connectModalOpen,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');
        // call this function when you want to disconnect the wallet
          // call the disconnect method on sdk object

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button onClick={openConnectModal} type="button">
                    <FaWallet className='w-7 h-7 text-gray-700' />
                  </button>
                );
              }
              if (connected) {
                return (
                  <>
                    <div className='flex items-center'>
                      <button onClick={openAccountModal} type="button">
                        <FaUserCircle className='w-7 h-7 text-gray-700 mr-5' />
                      </button>
                      <button onClick={()=>{}} type="button">
                        <FaSignOutAlt className='w-7 h-7 text-gray-700 mr-5' />
                      </button>
                      <button onClick={openConnectModal} type="button">
                        <FaWallet className='w-7 h-7 text-gray-700' />
                      </button>
                    </div>
                  </>
                );
              }

              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button">
                    Wrong network
                  </button>
                );
              }

              return (
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={openChainModal}
                    style={{ display: 'flex', alignItems: 'center' }}
                    type="button"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 12,
                          height: 12,
                          borderRadius: 999,
                          overflow: 'hidden',
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            style={{ width: 12, height: 12 }}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </button>

                  <button onClick={openAccountModal} type="button">
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ''}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};